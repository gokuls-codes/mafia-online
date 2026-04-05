'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, GameStatus, ROLES, Faction } from '@/types/game';

interface GameContextType {
  room: (Room & { join_code?: string; last_night_summary?: any; mafia_target?: string | null }) | null;
  players: Player[];
  me: Player | null;
  setRoomId: (id: string | null) => void;
  createRoom: (name: string, hostName: string) => Promise<string>;
  joinRoom: (roomId: string, name: string) => Promise<void>;
  joinRoomByCode: (code: string, name: string) => Promise<void>;
  updateSettings: (settings: Room['settings']) => Promise<void>;
  startGame: () => Promise<void>;
  nextPhase: () => Promise<void>;
  performAction: (targetId: string) => Promise<void>;
  voteForPlayer: (targetId: string) => Promise<void>;
  confirmMafiaTarget: (targetId: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [me, setMe] = useState<Player | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initialize User ID
    let id = sessionStorage.getItem('mafia_user_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('mafia_user_id', id);
    }
    setUserId(id);

    // 2. Auto-resume Room ID
    const savedRoomId = sessionStorage.getItem('mafia_room_id');
    if (savedRoomId && !roomId) {
      setRoomId(savedRoomId);
    }
  }, []);

  useEffect(() => {
    // Check URL for join code
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('code');
    
    if (codeFromUrl && !roomId) {
      // Room detection from URL is handled by the landing page
      // but we log it here for context
      console.log('Detected join code from URL:', codeFromUrl);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setPlayers([]);
      setMe(null);
      return;
    }

    // Subscribe to room and player changes
    const roomSub = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'rooms', 
        filter: `id=eq.${roomId}` 
      }, (payload: any) => {
        console.log('Room changed:', payload);
        const data = payload.new;
        if (data) {
          setRoom({
            id: data.id,
            name: data.name,
            hostId: data.host_id,
            status: data.status,
            winnerFaction: data.winner_faction,
            settings: data.settings,
            createdAt: data.created_at,
            join_code: data.join_code,
            last_night_summary: data.last_night_summary,
            last_vote_summary: data.last_vote_summary,
            mafia_target: data.mafia_target,
          } as any);
        }
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players', 
        filter: `room_id=eq.${roomId}` 
      }, (payload: any) => {
        console.log('Player changed:', payload);
        fetchPlayers();
      })
      .subscribe((status) => {
        console.log('Supabase subscription status:', status);
      });

    const fetchRoom = async () => {
      const { data } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (data) {
        setRoom({
          id: data.id,
          name: data.name,
          hostId: data.host_id,
          status: data.status,
          winnerFaction: data.winner_faction,
          settings: data.settings,
          createdAt: data.created_at,
          join_code: data.join_code,
          last_night_summary: data.last_night_summary,
          last_vote_summary: data.last_vote_summary,
          mafia_target: data.mafia_target,
        } as any);
      }
    };

    const fetchPlayers = async () => {
      const { data } = await supabase.from('players')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      if (data) {
        const mappedPlayers = data.map((p: any) => ({
          id: p.id,
          roomId: p.room_id,
          userId: p.user_id,
          name: p.name,
          roleId: p.role_id,
          faction: p.faction,
          isAlive: p.is_alive,
          isHost: p.is_host,
          voteTarget: p.vote_target,
          actionTarget: p.action_target,
          lastActionTarget: p.last_action_target
        }));
        setPlayers(mappedPlayers);
        const myPlayer = mappedPlayers.find(p => p.userId === userId);
        if (myPlayer) setMe(myPlayer);
      }
    };

    fetchRoom();
    fetchPlayers();

    return () => {
      supabase.removeChannel(roomSub);
    };
  }, [roomId, userId]);

  const checkWinConditions = (allPlayers: any[]) => {
    const alive = allPlayers.filter(p => p.is_alive);
    const mafiaCount = alive.filter(p => p.faction === 'Mafia').length;
    const townCount = alive.filter(p => p.faction === 'Town').length;
    const neutralKillers = alive.filter(p => p.role_id === 'serial_killer').length;

    if (mafiaCount === 0 && neutralKillers === 0) return { winner: 'Town' };
    if (mafiaCount >= (townCount + neutralKillers)) return { winner: 'Mafia' };
    if (alive.length === 1 && neutralKillers === 1) return { winner: 'Neutral' };
    
    return { winner: null };
  };

  const createRoom = async (name: string, hostName: string) => {
    if (!userId) throw new Error('Not initialized');

    // Generate a 6-character alphanumeric code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newRoom = {
      name,
      status: 'Lobby',
      host_id: userId,
      join_code: joinCode,
      settings: {
        roleCounts: { [ROLES.VILLAGER.id]: 3, [ROLES.MAFIA.id]: 1, [ROLES.DOCTOR.id]: 1 },
        timerNight: 40,
        timerDay: 90,
        timerVoting: 45,
      },
    };

    const { data: roomData, error: roomError } = await supabase.from('rooms').insert(newRoom).select().single();
    if (roomError) throw roomError;

    const { data: playerData, error: playerError } = await supabase.from('players').insert({
      room_id: roomData.id,
      user_id: userId,
      name: hostName,
      is_host: true,
      is_alive: true,
    }).select().single();

    if (playerError) throw playerError;

    sessionStorage.setItem('mafia_room_id', roomData.id);
    setRoomId(roomData.id);
    return roomData.id;
  };

  const joinRoomByCode = async (code: string, name: string) => {
    if (!userId) throw new Error('Not initialized');

    const { data: roomData, error: roomFindError } = await supabase
      .from('rooms')
      .select('id')
      .eq('join_code', code.toUpperCase())
      .single();

    if (roomFindError || !roomData) throw new Error('Room not found');

    await joinRoom(roomData.id, name);
  };

  const joinRoom = async (id: string, name: string) => {
    if (!userId) throw new Error('Not initialized');

    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', id)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) {
      setRoomId(id);
      return;
    }

    const { error } = await supabase.from('players').insert({
      room_id: id,
      user_id: userId,
      name,
      is_host: false,
      is_alive: true,
    });

    if (error) throw error;
    sessionStorage.setItem('mafia_room_id', id);
    setRoomId(id);
  };

  const updateSettings = async (settings: Room['settings']) => {
    if (!roomId) return;
    await supabase.from('rooms').update({ settings: settings as any }).eq('id', roomId);
  };

  const startGame = async () => {
    if (!roomId || !room) return;
    
    // 1. Prepare role pool
    const rolePool: string[] = [];
    Object.entries(room.settings.roleCounts).forEach(([roleId, count]) => {
      for (let i = 0; i < count; i++) rolePool.push(roleId);
    });

    // 2. Strict Check: roles must exactly match players
    if (rolePool.length !== players.length) {
      console.error('Role count mismatch!', rolePool.length, players.length);
      return;
    }

    // 3. Shuffle
    const shuffledRoles = [...rolePool].sort(() => Math.random() - 0.5);

    // 4. Update players
    for (let i = 0; i < players.length; i++) {
        const roleId = shuffledRoles[i];
        const role = ROLES[roleId.toUpperCase()];
        await supabase.from('players').update({ 
            role_id: roleId,
            faction: role.faction
        }).eq('id', players[i].id);
    }

    // 5. Set room to Night
    await supabase.from('rooms').update({ status: 'Night' }).eq('id', roomId);
  };

  const nextPhase = async () => {
    if (!roomId || !room) return;
    
    if (room.status === 'Night') {
      // --- NIGHT RESOLUTION LOGIC ---
      
      // 1. Get the TRUTHY latest data from the DB to avoid race conditions with local state
      const { data: latestPlayers } = await supabase.from('players').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
      if (!latestPlayers) return;

      const alivePlayers = latestPlayers.filter(p => p.is_alive);
      const mafiaVictimId = room.mafia_target;
      const doctorSaves = alivePlayers.filter(p => p.role_id === 'doctor' && p.action_target).map(p => p.action_target);
      const policeActions = alivePlayers.filter(p => p.role_id === 'police' && p.action_target);
      
      const deadIds = new Set<string>();
      const deadNames: string[] = [];

      // 2. Mafia Victim Check
      if (mafiaVictimId) {
          const victim = latestPlayers.find(p => p.id === mafiaVictimId);
          if (victim && !doctorSaves.includes(mafiaVictimId)) {
              deadIds.add(mafiaVictimId);
              deadNames.push(victim.name);
          }
      }

      // 3. Police (Vigilante) Logic
      for (const vigilante of policeActions) {
          const pId = vigilante.action_target;
          if (!pId) continue;
          
          const target = latestPlayers.find(p => p.id === pId);
          if (!target) continue;

          // Case-insensitive faction and SK check
          const isHostile = target.faction?.toLowerCase() === 'mafia' || target.role_id === 'serial_killer';
          
          if (isHostile) {
              if (!deadIds.has(pId)) {
                  deadIds.add(pId);
                  deadNames.push(target.name);
              }
          } else {
              // Killed an innocent! Vigilante dies from guilt too.
              if (!deadIds.has(vigilante.id)) {
                  deadIds.add(vigilante.id);
                  deadNames.push(vigilante.name);
              }
          }
      }

      // 5. Apply deaths & Clear actions
      for (const pId of Array.from(deadIds)) {
          await supabase.from('players').update({ is_alive: false }).eq('id', pId);
      }

      // Check Victory
      const allPlayersAfterNight = await supabase.from('players').select('*').eq('room_id', roomId);
      const { winner } = checkWinConditions(allPlayersAfterNight.data || []);
      
      if (winner) {
          await supabase.from('rooms').update({ 
              status: 'Finished', 
              winner_faction: winner as Faction 
          }).eq('id', roomId);
          return;
      }

      // Prepare summary
      const summary = {
          deadNames,
          message: deadNames.length === 0 
            ? 'A miracle has occurred—the city wakes up to find everyone survived the night!'
            : `The city wakes up to tragedy... ${deadNames.length === 1 
                ? `${deadNames[0]} was found dead.` 
                : `${deadNames.slice(0, -1).join(', ')} and ${deadNames.slice(-1)} were found dead.`}`
      };

      for (const p of latestPlayers) {
          await supabase.from('players').update({ 
               last_action_target: p.action_target,
               action_target: null,
               vote_target: null
          }).eq('id', p.id);
      }

      await supabase.from('rooms').update({ 
          status: 'Day', 
          last_night_summary: summary as any,
          mafia_target: null
      }).eq('id', roomId);
      return; 
    }

    if (room.status === 'Voting') {
      // --- VOTING RESOLUTION LOGIC ---
      const activePlayers = players.filter(p => p.isAlive);
      const votes: Record<string, number> = {};
      activePlayers.forEach(p => {
          if (p.voteTarget) {
              votes[p.voteTarget] = (votes[p.voteTarget] || 0) + 1;
          }
      });

      // Find winner
      let winnerId: string | null = null;
      let maxVotes = 0;
      Object.entries(votes).forEach(([id, count]) => {
          if (count > maxVotes) {
              maxVotes = count;
              winnerId = id;
          }
      });

      // Check if winner was pardoned by Magistrate (Mayor)
      const mayorAction = players.find(p => p.roleId === 'mayor' && p.isAlive);
      const isPardoned = winnerId && mayorAction?.actionTarget === winnerId;

      // Prepare summary
      const winner = players.find(p => p.id === winnerId);
      const voteSummary = {
          deadNames: (winnerId && !isPardoned) ? [winner?.name || 'Unknown'] : [],
          message: isPardoned
            ? `The mob has spoken, but the Mayor has granted ${winner?.name} an executive pardon. No one was evicted today.`
            : (winnerId 
                ? `The town has reached a verdict. ${winner?.name} has been sentenced to death.`
                : 'The town could not reach a clear majority. No one was evicted today.')
      };

      if (winnerId && !isPardoned) {
          await supabase.from('players').update({ is_alive: false }).eq('id', winnerId);
      }

      // Check Victory
      const allPlayersAfterVote = await supabase.from('players').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
      const { winner: winFaction } = checkWinConditions(allPlayersAfterVote.data || []);

      if (winFaction) {
          await supabase.from('rooms').update({ 
              status: 'Finished', 
              winner_faction: winFaction as Faction 
          }).eq('id', roomId);
          return;
      }

      // Reset and move to Verdict
      await supabase.from('players').update({ vote_target: null, action_target: null }).eq('room_id', roomId);
      await supabase.from('rooms').update({ 
          status: 'Verdict', 
          last_vote_summary: voteSummary as any 
      }).eq('id', roomId);
      return;
    }

    if (room.status === 'Verdict') {
        const deadIds = room.last_vote_summary?.deadNames || [];
        // The player is already officially deceased if listed (optional check)
        // Check Victory before moving to Night
        const allPlayersAfterVerdict = await supabase.from('players').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
        const { winner: winFaction } = checkWinConditions(allPlayersAfterVerdict.data || []);

        if (winFaction) {
            await supabase.from('rooms').update({ 
                status: 'Finished', 
                winner_faction: winFaction as Faction 
            }).eq('id', roomId);
            return;
        }

        await supabase.from('rooms').update({ status: 'Night' }).eq('id', roomId);
        return;
    }

    if (room.status === 'Finished') {
        // Reset room to lobby
        await supabase.from('rooms').update({ status: 'Lobby', winner_faction: null }).eq('id', roomId);
        await supabase.from('players').update({ is_alive: true, role_id: null, faction: null, vote_target: null, action_target: null }).eq('room_id', roomId);
        return;
    }

    const phases: GameStatus[] = ['Lobby', 'Night', 'Day', 'Voting', 'Verdict', 'Finished'];
    const currentIndex = phases.indexOf(room.status);
    const nextIndex = (currentIndex + 1) % phases.length;
    await supabase.from('rooms').update({ status: phases[nextIndex] }).eq('id', roomId);
  };

  const performAction = async (targetId: string) => {
    if (!me || !roomId) return;
    
    // EVERYONE now stores their choice in their own player row first.
    // This allows Mafia members to see each other's preferences.
    const { error } = await supabase.from('players').update({ action_target: targetId }).eq('id', me.id);
    if (error) console.error('Role action error:', error);
  };

  const confirmMafiaTarget = async (targetId: string) => {
    if (!me || !roomId) return;
    
    // Only Mafia/Godfather can confirm the syndicate target
    const roleId = me.roleId?.toLowerCase();
    if (roleId === 'mafia' || roleId === 'godfather') {
        const { error } = await supabase.from('rooms').update({ mafia_target: targetId }).eq('id', roomId);
        if (error) console.error('Mafia syndicate action error:', error);
    }
  };

  const voteForPlayer = async (targetId: string) => {
    if (!me || !roomId) return;
    await supabase.from('players').update({ vote_target: targetId }).eq('id', me.id);
  };

  return (
    <GameContext.Provider value={{
      room,
      players,
      me,
      setRoomId,
      createRoom,
      joinRoom,
      joinRoomByCode,
      updateSettings,
      startGame,
      nextPhase,
      performAction,
      voteForPlayer,
      confirmMafiaTarget
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
