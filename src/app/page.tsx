'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from '@/store/GameContext';
import { LogIn, Plus, Users, Shield, UserX, Skull, Search, Info, HelpCircle, Moon } from 'lucide-react';
import { ROLES, Faction } from '@/types/game';

function LandingPage({ onCreate, onJoinByCode }: { onCreate: (name: string, hostName: string) => void, onJoinByCode: (code: string, name: string) => void }) {
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [name, setName] = useState('');
  const [hostName, setHostName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  // Handle URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setRoomCode(code.toUpperCase());
      setMode('join');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {mode === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-xl"
          >
            <h1 className="text-7xl font-cinzel font-extrabold text-accent mb-4 tracking-tighter drop-shadow-xl">
              MAFIA
            </h1>
            <p className="text-xl text-zinc-400 font-outfit mb-12 tracking-wide">
              THINK LIKE A CRIMINAL. ACT LIKE A CITIZEN. SURVIVE THE NIGHT.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setMode('create')}
                className="flex items-center justify-center gap-2 p-6 glass rounded-2xl border-accent/20 hover:border-accent/80 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="w-6 h-6 text-accent" />
                <span className="text-xl font-cinzel">CREATE ROOM</span>
              </button>
              
              <button 
                onClick={() => setMode('join')}
                className="flex items-center justify-center gap-2 p-6 glass rounded-2xl border-zinc-700 hover:border-zinc-500 transition-all group"
              >
                <Users className="w-6 h-6 text-zinc-400" />
                <span className="text-xl font-cinzel">JOIN GAME</span>
              </button>
            </div>
            
            <div className="mt-16 flex justify-center gap-8 text-zinc-600">
               <div className="flex items-center gap-2">
                 <Shield className="w-5 h-5" />
                 <span>STRATEGY</span>
               </div>
               <div className="flex items-center gap-2">
                 <UserX className="w-5 h-5" />
                 <span>DECEPTION</span>
               </div>
               <div className="flex items-center gap-2">
                 <Skull className="w-5 h-5" />
                 <span>SURVIVAL</span>
               </div>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl w-full max-w-md border-accent/30 shadow-red"
          >
            <h2 className="text-3xl font-cinzel mb-6 text-accent">ESTABLISH OPERATIONS</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-500 text-sm mb-2 uppercase tracking-widest font-bold">Your Alias</label>
                <input 
                  type="text" 
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Al Capone"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-accent outline-none text-xl transition-all"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-sm mb-2 uppercase tracking-widest font-bold">Room Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gotham City"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-accent outline-none text-xl transition-all"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setMode('home')}
                  className="p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all font-cinzel"
                >BACK</button>
                <button 
                  onClick={() => onCreate(name, hostName)}
                  disabled={!name || !hostName}
                  className="flex-1 p-4 rounded-xl bg-accent hover:bg-accent-muted transition-all font-cinzel disabled:opacity-50"
                >START OPERATION</button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl w-full max-w-md border-zinc-800"
          >
            <h2 className="text-3xl font-cinzel mb-6">INTERROGATE ROOM</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-500 text-sm mb-2 uppercase tracking-widest font-bold">Your Alias</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sherlock"
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-zinc-600 outline-none text-xl transition-all"
                />
              </div>
              <div>
                <label className="block text-zinc-500 text-sm mb-2 uppercase tracking-widest font-bold">Room invite Code</label>
                <input 
                  type="text" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-char code..."
                  maxLength={6}
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:border-zinc-600 outline-none text-xl transition-all font-mono tracking-tighter"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setMode('home')}
                  className="p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-all font-cinzel"
                >BACK</button>
                <button 
                  onClick={() => onJoinByCode(roomCode, name)}
                  disabled={!roomCode || !name}
                  className="flex-1 p-4 rounded-xl bg-zinc-200 text-black hover:bg-white transition-all font-cinzel disabled:opacity-50"
                >ENTER ROOM</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ roleId, count, onIncrement, onDecrement, canEdit }: { roleId: string, count: number, onIncrement: () => void, onDecrement: () => void, canEdit: boolean }) {
  const role = ROLES[roleId.toUpperCase()];
  if (!role) return null;

  return (
    <div className="flex items-center justify-between p-4 glass rounded-2xl border-zinc-800">
      <div className="flex flex-col">
        <span className="font-cinzel text-lg flex items-center gap-2">
            {role.name}
        </span>
        <span className="text-xs text-zinc-500">{role.description}</span>
      </div>
      <div className="flex items-center gap-4">
        {canEdit && (
          <button 
            onClick={onDecrement}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-600">-</button>
        )}
        <span className="text-xl font-cinzel font-bold">{count}</span>
        {canEdit && (
          <button 
            onClick={onIncrement}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-zinc-600">+</button>
        )}
      </div>
    </div>
  );
}

function Lobby() {
  const { room, players, me, startGame, updateSettings } = useGame();
  
  if (!room) return null;

  const handleRoleCount = (roleId: string, delta: number) => {
    const current = room.settings.roleCounts[roleId] || 0;
    const next = Math.max(0, current + delta);
    updateSettings({
      ...room.settings,
      roleCounts: {
        ...room.settings.roleCounts,
        [roleId]: next
      }
    });
  };

  const totalAssignedRoles = Object.values(room.settings.roleCounts).reduce((a, b) => a + b, 0);
  const isBalanced = totalAssignedRoles === players.length;
  const needsMore = players.length > totalAssignedRoles;
  const tooMany = totalAssignedRoles > players.length;

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-4xl font-cinzel mb-2 flex items-center gap-4">
              <Shield className="text-accent" />
              ROLE CONFIGURATION
            </h2>
            <p className="text-zinc-500">Assign roles to the inhabitants of {room.name}</p>
          </div>
          <div className={`text-right ${isBalanced ? 'text-green-500' : 'text-accent'}`}>
            <div className="text-3xl font-cinzel leading-none">{totalAssignedRoles} / {players.length}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold mt-1 opacity-60">Roles Assigned</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RoleBadge roleId="mafia" count={room.settings.roleCounts['mafia'] || 0} 
            onIncrement={() => handleRoleCount('mafia', 1)}
            onDecrement={() => handleRoleCount('mafia', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="doctor" count={room.settings.roleCounts['doctor'] || 0} 
            onIncrement={() => handleRoleCount('doctor', 1)}
            onDecrement={() => handleRoleCount('doctor', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="detective" count={room.settings.roleCounts['detective'] || 0} 
            onIncrement={() => handleRoleCount('detective', 1)}
            onDecrement={() => handleRoleCount('detective', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="police" count={room.settings.roleCounts['police'] || 0} 
            onIncrement={() => handleRoleCount('police', 1)}
            onDecrement={() => handleRoleCount('police', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="mayor" count={room.settings.roleCounts['mayor'] || 0} 
            onIncrement={() => handleRoleCount('mayor', 1)}
            onDecrement={() => handleRoleCount('mayor', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="innocent" count={room.settings.roleCounts['innocent'] || 0} 
            onIncrement={() => handleRoleCount('innocent', 1)}
            onDecrement={() => handleRoleCount('innocent', -1)}
            canEdit={me?.isHost || false}
          />
          <RoleBadge roleId="villager" count={room.settings.roleCounts['villager'] || 0} 
            onIncrement={() => handleRoleCount('villager', 1)}
            onDecrement={() => handleRoleCount('villager', -1)}
            canEdit={me?.isHost || false}
          />
        </div>

        {me?.isHost && (
          <div className="space-y-4">
            {tooMany && (
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-2xl text-accent text-sm flex items-center gap-3">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>You have assigned {totalAssignedRoles - players.length} too many roles. Remove some to start.</span>
              </div>
            )}
            {needsMore && players.length >= 3 && (
              <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-zinc-400 text-sm flex items-center gap-3">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>You need to assign {players.length - totalAssignedRoles} more roles (e.g. Villagers) to start.</span>
              </div>
            )}
            
            <button 
              onClick={startGame}
              disabled={!isBalanced || players.length < 3}
              className="w-full p-6 text-2xl font-cinzel bg-accent hover:bg-accent-muted transition-all rounded-3xl shadow-red flex items-center justify-center gap-4 group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isBalanced ? 'COMMENCE OPERATION' : 'WAITING FOR BALANCE'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-panel-bg p-8 rounded-3xl border border-zinc-800 space-y-6">
        <h3 className="text-2xl font-cinzel border-b border-zinc-800 pb-4">PARTICIPANTS</h3>
        <div className="space-y-4">
          {players.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Users className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-medium flex items-center gap-2">
                    {p.name}
                    {p.isHost && <Shield className="w-3 h-3 text-accent" />}
                    {p.id === me?.id && <span className="text-[10px] text-zinc-500 font-bold uppercase">(You)</span>}
                </span>
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{p.isAlive ? 'Status: Active' : 'Status: Deceased'}</span>
              </div>
            </div>
          ))}
          
          {players.length < 3 && (
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl text-xs text-accent uppercase tracking-widest text-center mt-8">
              Waiting for minimum 4 players...
            </div>
          )}
        </div>
        
        <div className="mt-12 pt-12 border-t border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Invite Room</label>
            <span className="text-[10px] text-zinc-600 font-mono">Code: {room.join_code}</span>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?code=${room.join_code}`;
                navigator.clipboard.writeText(url);
                // toast could be added here
              }}
              className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm hover:bg-zinc-800 transition-all font-cinzel flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
              COPY INVITE LINK
            </button>
            <div className="flex items-center gap-2 mt-2">
               <div className="h-px flex-1 bg-zinc-800"></div>
               <span className="text-[10px] text-zinc-700 uppercase font-bold tracking-widest">or share code</span>
               <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="p-4 bg-black border border-dashed border-zinc-800 rounded-xl text-center font-mono text-2xl tracking-[0.5em] text-zinc-400">
                {room.join_code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NightView() {
  const { room, players, me, performAction, confirmMafiaTarget, nextPhase } = useGame();
  
  if (!room || !me) return null;

  const role = me.roleId ? ROLES[me.roleId.toUpperCase()] : null;
  const otherPlayers = players.filter(p => p.id !== me.id && p.isAlive);
  
  // Custom action label based on role
  const getActionPrompt = () => {
    switch(me.roleId) {
      case 'doctor': return 'WHO WILL YOU SAVE FROM THE MAFIA TONIGHT?';
      case 'mafia': 
      case 'godfather': return 'WHO MUST BE ELIMINATED BY THE FAMILY?';
      case 'detective': return 'WHO WILL YOU SCRUTINIZE FOR SUSPICIOUS ACTIVITY?';
      case 'police': return 'WHO WILL YOU PASS JUDGEMENT UPON?';
      case 'mayor': return 'WHO WILL YOU GRANT AN EXECUTIVE PARDON?';
      default: return 'SLEEP WELL... IF YOU CAN.';
    }
  };

  const isMafiaRole = ['mafia', 'godfather'].includes(me.roleId?.toLowerCase() || '');
  // Mafia sees their personal preference until finalized in room.mafia_target
  // Other roles ONLY see their own actionTarget
  const activeTargetId = isMafiaRole 
    ? (room.mafia_target || me.actionTarget) 
    : me.actionTarget;
    
  const targetPlayer = players.find(p => p.id === activeTargetId);
  const targetName = targetPlayer?.name;
  
  // Detective Logic: Neutral & Godfather show as VILLAGER, but "Innocent" role shows as MAFIA
  let detectiveResult: 'MAFIA' | 'VILLAGER' | null = null;
  if (targetPlayer && me.roleId === 'detective') {
      const isMafia = targetPlayer.faction === 'Mafia';
      const isGodfather = targetPlayer.roleId === 'godfather';
      const isInnocentRole = targetPlayer.roleId === 'innocent';
      
      // Godfather is Mafia but appears as VILLAGER
      if ((isMafia && !isGodfather) || isInnocentRole) {
          detectiveResult = 'MAFIA';
      } else {
          detectiveResult = 'VILLAGER';
      }
  }

  const isSavingRole = ['doctor', 'mayor'].includes(me.roleId?.toLowerCase() || '');
  const hasAction = ['doctor', 'mafia', 'godfather', 'detective', 'police', 'mayor'].includes(me.roleId?.toLowerCase() || '');
  const isDetectiveLocked = me.roleId?.toLowerCase() === 'detective' && me.actionTarget;
  
  // 1. Lock if you are Mafia and the hit is already finalized in room.mafia_target
  // 2. Lock if you are a Detective and have already completed your investigation
  // 3. Lock instantly for any role NOT listed (Doctor/Police/Mayor/Mafia can change until lock)
  const isActionLocked = Boolean(
    (isMafiaRole && room.mafia_target) || 
    isDetectiveLocked || 
    (me.actionTarget && !['doctor', 'police', 'mayor', 'mafia', 'godfather'].includes(me.roleId?.toLowerCase() || ''))
  );
  
  // Get other mafia preferences
  const otherMafia = players.filter(p => p.id !== me.id && ['mafia', 'godfather'].includes(p.roleId?.toLowerCase() || ''));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-cinzel text-zinc-500 tracking-[0.2em] animate-pulse">NIGHT FALLS</h2>
        <p className="text-zinc-600 font-outfit uppercase tracking-widest text-sm">Operation: Silence</p>
      </div>

      <div className={`grid grid-cols-1 ${hasAction ? 'md:grid-cols-2' : ''} gap-8 items-start`}>
        {/* Role Card */}
        <div className={`glass p-8 rounded-3xl border-accent/20 relative overflow-hidden group ${!hasAction ? 'max-w-xl mx-auto' : ''}`}>
          <div className="absolute inset-0 bg-accent/5 opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative z-10 space-y-6">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Your Secret Identity</span>
              <h3 className="text-4xl font-cinzel text-accent mt-1">{role?.name || 'CITIZEN'}</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{role?.description}</p>
            <div className="pt-6 border-t border-white/5 font-cinzel text-xl text-zinc-300">
               {isDetectiveLocked ? 'INVESTIGATION COMPLETE' : (isMafiaRole && room.mafia_target ? 'STRIKE COORDINATED' : getActionPrompt())}
            </div>
            
                    {activeTargetId && (
                        <div className="space-y-3">
                            <div className={`border p-4 rounded-xl text-center font-bold relative ${
                                isSavingRole 
                                ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                                : 'bg-accent/10 border-accent/30 text-accent'
                            }`}>
                                {isDetectiveLocked ? 'FILE CLOSED: ' : (isMafiaRole && room.mafia_target ? 'STRIKE FINALIZED: ' : (isMafiaRole ? 'YOUR PREFERENCE: ' : 'TARGET: '))} {targetName}
                                {isMafiaRole && room.mafia_target && <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="absolute -top-3 -right-3 bg-accent text-white text-[8px] px-2 py-1 rounded-full font-black ring-4 ring-black">LOCKED</motion.div>}
                            </div>
                            
                            {isMafiaRole && activeTargetId && !room.mafia_target && (
                                <button 
                                    onClick={() => confirmMafiaTarget(activeTargetId)}
                                    className="w-full p-4 bg-accent text-white font-cinzel rounded-xl shadow-red hover:scale-105 transition-transform"
                                >
                                    CONFIRM SYNDICATE HIT
                                </button>
                            )}
                            
                            {detectiveResult && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl text-center font-cinzel text-sm border ${
                                detectiveResult === 'MAFIA' 
                                ? 'bg-red-950/20 border-red-500/50 text-red-500' 
                                : 'bg-green-950/20 border-green-500/50 text-green-500'
                            }`}
                        >
                            REVEAL: {detectiveResult}
                        </motion.div>
                    )}
                </div>
            )}

            {!hasAction && (
                <div className="pt-8 flex flex-col items-center gap-4 text-zinc-600 italic">
                    <Moon className="w-12 h-12 opacity-20" />
                    <p className="text-center">The city sleeps... but the shadows are moving. Try to make it to morning.</p>
                </div>
            )}
          </div>
        </div>

        {/* Action List - Only show if player has an action */}
        {hasAction && (
          <div className="space-y-4">
            <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold px-2">Potential Targets</h4>
            <div className="grid grid-cols-1 gap-2">
              {otherPlayers.map(p => (
                <button 
                  key={p.id}
                  onClick={() => hasAction && !isActionLocked && performAction(p.id)}
                  disabled={!hasAction || isActionLocked}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all border group relative ${
                      activeTargetId === p.id 
                      ? (isSavingRole ? 'bg-green-600 border-green-500 text-white' : 'bg-accent border-accent text-white') 
                      : 'glass border-white/5 hover:border-zinc-500 text-zinc-400'
                  } disabled:opacity-50`}
                >
                  <div className="flex flex-col items-start translate-y-0.5">
                    <span className="font-outfit text-lg">{p.name}</span>
                    {isMafiaRole && (
                        <div className="flex gap-1 mt-1">
                            {players.filter(mp => ['mafia', 'godfather'].includes(mp.roleId?.toLowerCase() || '') && mp.actionTarget === p.id).map(mp => (
                                <div key={mp.id} className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter ${mp.id === me.id ? 'bg-white text-black' : 'bg-red-800 text-white opacity-70'}`}>
                                    {mp.id === me.id ? 'YOU' : mp.name.split(' ')[0]}
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                  {hasAction && <Search className={`w-4 h-4 ${activeTargetId === p.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />}
                </button>
              ))}
              
              {isActionLocked && (
                  <div className="p-4 text-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-white/5 rounded-xl border border-white/5">
                     Choice is locked for the night
                  </div>
              )}
            </div>
          </div>
        )}
      </div>

      {me.isHost && (
          <div className="pt-12 space-y-8">
             {/* Host-Only Ready Check */}
             <div className="max-w-md mx-auto glass p-6 rounded-2xl border-white/5 space-y-4">
                <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center border-b border-white/5 pb-2">Night Tactical Overview</h4>
                <div className="space-y-3">
                   {/* Roles that have night actions */}
                   {['mafia', 'godfather', 'doctor', 'detective', 'police', 'mayor'].map(roleId => {
                      const totalWithRole = players.filter(p => p.roleId === roleId && p.isAlive).length;
                      if (totalWithRole === 0) return null;
                      const readyCount = players.filter(p => p.roleId === roleId && p.isAlive && p.actionTarget).length;
                      const role = ROLES[roleId.toUpperCase()];
                      return (
                        <div key={roleId} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                           <span className="text-zinc-400 text-sm font-cinzel">{role.name}</span>
                           <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full transition-all ${readyCount === totalWithRole ? 'bg-green-500' : 'bg-accent'}`} 
                                   style={{ width: `${(readyCount/totalWithRole) * 100}%` }}
                                 />
                              </div>
                              <span className={`text-[10px] font-bold ${readyCount === totalWithRole ? 'text-green-500' : 'text-zinc-500'}`}>
                                 {readyCount} / {totalWithRole}
                              </span>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </div>

             <div className="text-center">
                <button 
                  onClick={nextPhase}
                  className="px-12 py-4 bg-zinc-100 text-black font-cinzel text-lg rounded-full hover:bg-white transition-all shadow-xl shadow-white/5"
                >
                  BRING THE DAWN
                </button>
                <p className="mt-2 text-[10px] text-zinc-600 uppercase tracking-widest">Only the host can end the night</p>
             </div>
          </div>
      )}
    </motion.div>
  );
}

function DayView() {
  const { room, players, me, nextPhase } = useGame();
  
  if (!room || !me) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-cinzel text-accent tracking-[0.2em]">DAY BREAK</h2>
        <p className="text-zinc-500 font-outfit uppercase tracking-widest text-sm">Discussion & Debate</p>
      </div>

      {/* Morning Bulletin */}
      <div className="glass p-8 rounded-3xl border-white/5 bg-accent/5 backdrop-blur-md">
         <div className="flex items-center gap-4 mb-4">
            <Skull className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-cinzel">The Morning Report</h3>
         </div>
         <p className="text-xl text-zinc-300 font-outfit leading-relaxed italic">
            "{room.last_night_summary?.message || 'The city wakes up to a quiet dawn...'}"
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold px-2">Survivor Status</h4>
          <div className="grid grid-cols-1 gap-2">
            {players.map(p => (
              <div 
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-2xl glass border ${
                    p.isAlive ? 'border-white/5 opacity-100' : 'border-red-900/50 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${p.isAlive ? 'bg-zinc-800' : 'bg-red-900/20 text-red-500'}`}>
                        {p.isAlive ? <Users className="w-4 h-4" /> : <Skull className="w-4 h-4" />}
                    </div>
                    <span className={`font-outfit text-lg ${p.isAlive ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>{p.name}</span>
                </div>
                {!p.isAlive && <span className="text-[10px] bg-red-900/30 text-red-500 px-2 py-1 rounded-md border border-red-500/20 font-bold uppercase tracking-tighter">Deceased</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
           <div className="text-center space-y-4">
              <HelpCircle className="w-12 h-12 mx-auto text-zinc-700" />
              <p className="text-zinc-400 text-sm italic">
                Discuss with your fellow citizens. Who among you hides the shadow of the mafia? Use your intuition to find the suspects.
              </p>
           </div>
           
           {me.isHost && (
               <button 
                 onClick={nextPhase}
                 className="w-full py-4 bg-accent text-white font-cinzel text-lg rounded-xl hover:bg-accent-muted transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
               >
                 CALL FOR A VOTE
               </button>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function VotingView() {
  const { room, players, me, voteForPlayer, nextPhase } = useGame();
  
  if (!room || !me) return null;

  const alivePlayers = players.filter(p => p.isAlive);
  const myVote = me.voteTarget;
  const isDead = !me.isAlive;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-cinzel text-red-500 tracking-[0.2em]">THE VERDICT</h2>
        <p className="text-zinc-500 font-outfit uppercase tracking-widest text-sm">Cast your judgment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <h4 className="text-xs text-zinc-500 uppercase tracking-widest font-bold px-2">Casting Ballot</h4>
          <div className="grid grid-cols-1 gap-3">
            {alivePlayers.map(p => (
              <button 
                key={p.id}
                onClick={() => !isDead && voteForPlayer(p.id)}
                disabled={isDead || p.id === me.id}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all border group relative overflow-hidden ${
                    myVote === p.id 
                    ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-900/40' 
                    : 'glass border-white/5 hover:border-zinc-500 text-zinc-400'
                } disabled:opacity-50`}
              >
                <span className="font-outfit text-xl font-medium">{p.name}</span>
                {myVote === p.id && <motion.div layoutId="vote-check" className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">Your Suspect</motion.div>}
              </button>
            ))}
          </div>
          {isDead && (
              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-red-400 text-sm italic text-center">
                  The dead have no voice in the city's judgment.
              </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-3xl border-white/5 space-y-6 bg-red-950/5">
              <Skull className="w-12 h-12 mx-auto text-red-500 opacity-50" />
              <div className="text-center space-y-2">
                 <h4 className="font-cinzel text-xl">THE GALLOWS AWAIT</h4>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Select the person you believe is working for the Mafia. If there is a majority, they will be executed at sunset.
                 </p>
              </div>
           </div>

           {me.isHost && (
               <div className="space-y-4">
                   <button 
                     onClick={nextPhase}
                     className="w-full py-6 bg-red-600 text-white font-cinzel text-2xl rounded-2xl hover:bg-red-500 transition-all shadow-xl shadow-red-900/40 flex items-center justify-center gap-3 group"
                   >
                     FINALIZE VERDICT
                   </button>
                   <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Host Power: Tally the votes and end the day</p>
               </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

function GameOverView() {
  const { room, players, me, nextPhase } = useGame();
  
  if (!room || !me) return null;

  const winner = room.winnerFaction;
  const isWinner = me.faction === winner;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 max-w-4xl mx-auto text-center space-y-12"
    >
      <div className="space-y-4">
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
            <Skull className={`w-20 h-20 mx-auto mb-4 ${winner === 'Mafia' ? 'text-red-500' : 'text-green-500'}`} />
            <h1 className="text-7xl font-cinzel font-black tracking-tighter drop-shadow-2xl">
                {winner?.toUpperCase()} VICTORIOUS
            </h1>
        </motion.div>
        <p className="text-xl text-zinc-400 font-outfit uppercase tracking-[0.3em]">
            {winner === 'Town' ? 'Justice has been served.' : 'The city has fallen into darkness.'}
        </p>
      </div>

      <div className="glass p-8 rounded-3xl border-white/5 space-y-6">
        <h3 className="text-xs text-zinc-500 uppercase tracking-widest font-bold border-b border-white/5 pb-4">The Final Reveal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {players.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
              <div className="text-left">
                <div className="font-outfit font-bold">{p.name}</div>
                <div className={`text-[10px] uppercase font-bold tracking-widest ${p.faction === 'Mafia' ? 'text-red-500' : 'text-green-500'}`}>
                    {ROLES[p.roleId?.toUpperCase() || '']?.name || 'VILLAGER'}
                </div>
              </div>
              <div className="text-[10px] text-zinc-600 font-bold uppercase transition-all">
                  {p.isAlive ? 'Survived' : 'Eliminated'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {me.isHost && (
          <button 
            onClick={nextPhase}
            className="px-12 py-6 bg-zinc-100 text-black font-cinzel text-2xl rounded-2xl hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto"
          >
            RETURN TO LOBBY
          </button>
      )}
    </motion.div>
  );
}

function MafiaApp() {
  const { room, players, me, createRoom, joinRoomByCode } = useGame();

  if (!room) {
    return <LandingPage onCreate={createRoom} onJoinByCode={joinRoomByCode} />;
  }

  if (room.status === 'Lobby') {
    return <Lobby />;
  }

  if (room.status === 'Night') {
    return <NightView />;
  }

  if (room.status === 'Day') {
    return <DayView />;
  }

  if (room.status === 'Voting') {
    return <VotingView />;
  }

  if (room.status === 'Finished') {
    return <GameOverView />;
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-cinzel text-accent">OPERATION IN PROGRESS: {room.status}</h1>
      <p className="mt-4">Current implementation focus: Night Actions.</p>
      <div className="mt-8 p-8 glass rounded-3xl max-w-md mx-auto">
        <h2 className="text-2xl font-cinzel mb-4">YOUR ASSIGNMENT</h2>
        <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl">
            <span className="text-4xl font-cinzel block mb-2">{me?.roleId?.toUpperCase() || 'STILL BREATHING'}</span>
            <p className="text-sm text-zinc-400">{me?.roleId ? ROLES[me.roleId.toUpperCase()]?.description : 'Wait for the host to start the game.'}</p>
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_50%_-20%,rgba(255,0,0,0.05),transparent_40%)]">
        <header className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center font-cinzel font-bold text-white shadow-red">M</div>
            <span className="font-cinzel tracking-widest font-bold">MAFIA ONLINE</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                RULES
            </a>
            <a href="#" className="hidden sm:flex text-xs text-zinc-500 hover:text-zinc-300 items-center gap-1">
                <Info className="w-3 h-3" />
                ROLES
            </a>
          </div>
        </header>

        <main className="relative">
          {/* Subtle background pulse */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute -top-[50%] -left-[20%] w-full h-full bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" />
             <div className="absolute -bottom-[50%] -right-[20%] w-full h-full bg-zinc-800/10 rounded-full blur-[120px]" />
          </div>

          <MafiaApp />
        </main>
      </div>
    </GameProvider>
  );
}
