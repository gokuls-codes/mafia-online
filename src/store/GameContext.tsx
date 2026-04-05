'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Room, Player, GameStatus, ROLES } from '@/types/game';

interface GameContextType {
  room: (Room & { join_code?: string }) | null;
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
        } as any);
      }
    };

    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('*').eq('room_id', roomId);
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
          actionTarget: p.action_target
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
        roleCounts: { [ROLES.VILLAGER.id]: 3, [ROLES.MAFIOSO.id]: 1, [ROLES.DOCTOR.id]: 1 },
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
    const phases: GameStatus[] = ['Lobby', 'Night', 'Day', 'Voting', 'Finished'];
    const currentIndex = phases.indexOf(room.status);
    const nextIndex = (currentIndex + 1) % phases.length;
    await supabase.from('rooms').update({ status: phases[nextIndex] }).eq('id', roomId);
  };

  const performAction = async (targetId: string) => {
    if (!me || !roomId) return;
    await supabase.from('players').update({ action_target: targetId }).eq('id', me.id);
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
      performAction
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
