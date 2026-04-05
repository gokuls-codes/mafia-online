'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from '@/store/GameContext';
import { LogIn, Plus, Users, Shield, UserX, Skull, Search, Info, HelpCircle } from 'lucide-react';
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
          <RoleBadge roleId="mafioso" count={room.settings.roleCounts['mafioso'] || 0} 
            onIncrement={() => handleRoleCount('mafioso', 1)}
            onDecrement={() => handleRoleCount('mafioso', -1)}
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

function MafiaApp() {
  const { room, players, me, createRoom, joinRoomByCode } = useGame();

  if (!room) {
    return <LandingPage onCreate={createRoom} onJoinByCode={joinRoomByCode} />;
  }

  if (room.status === 'Lobby') {
    return <Lobby />;
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-cinzel text-accent">OPERATION IN PROGRESS: {room.status}</h1>
      <p className="mt-4">Current implementation focus: Lobby and State management.</p>
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
      <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_50%_-20%,_rgba(255,0,0,0.05),_transparent_40%)]">
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
