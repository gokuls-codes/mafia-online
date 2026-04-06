import { AnimatePresence, motion } from "framer-motion";
import { Plus, Shield, Skull, UserX, Users } from "lucide-react";
import { useEffect, useState } from "react";

type LandingPageProps = {
  onCreate: (name: string, hostName: string) => void;
  onJoinByCode: (code: string, name: string) => void;
};

export function LandingPage({
  onCreate,
  onJoinByCode,
}: LandingPageProps) {
  const [mode, setMode] = useState<"home" | "create" | "join">("home");
  const [name, setName] = useState("");
  const [hostName, setHostName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      setRoomCode(code.toUpperCase());
      setMode("join");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {mode === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl text-center"
          >
            <h1 className="mb-4 text-7xl font-extrabold tracking-tighter text-accent drop-shadow-xl font-cinzel">
              MAFIA
            </h1>
            <p className="mb-12 text-xl tracking-wide text-zinc-400 font-outfit">
              THINK LIKE A CRIMINAL. ACT LIKE A CITIZEN. SURVIVE THE NIGHT.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                onClick={() => setMode("create")}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-accent/20 p-6 glass transition-all hover:border-accent/80"
              >
                <div className="absolute inset-0 bg-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <Plus className="h-6 w-6 text-accent" />
                <span className="text-xl font-cinzel">CREATE ROOM</span>
              </button>

              <button
                onClick={() => setMode("join")}
                className="group flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 p-6 glass transition-all hover:border-zinc-500"
              >
                <Users className="h-6 w-6 text-zinc-400" />
                <span className="text-xl font-cinzel">JOIN GAME</span>
              </button>
            </div>

            <div className="mt-16 flex justify-center gap-8 text-zinc-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>STRATEGY</span>
              </div>
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                <span>DECEPTION</span>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="h-5 w-5" />
                <span>SURVIVAL</span>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "create" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-accent/30 p-8 glass shadow-red"
          >
            <h2 className="mb-6 text-3xl text-accent font-cinzel">
              ESTABLISH OPERATIONS
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Your Alias
                </label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(event) => setHostName(event.target.value)}
                  placeholder="e.g. Al Capone"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xl outline-none transition-all focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Room Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Gotham City"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xl outline-none transition-all focus:border-accent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setMode("home")}
                  className="rounded-xl bg-zinc-800 p-4 transition-all hover:bg-zinc-700 font-cinzel"
                >
                  BACK
                </button>
                <button
                  onClick={() => onCreate(name, hostName)}
                  disabled={!name || !hostName}
                  className="flex-1 rounded-xl bg-accent p-4 transition-all hover:bg-accent-muted disabled:opacity-50 font-cinzel"
                >
                  START OPERATION
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === "join" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-3xl border border-zinc-800 p-8 glass"
          >
            <h2 className="mb-6 text-3xl font-cinzel">INTERROGATE ROOM</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Your Alias
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Sherlock"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xl outline-none transition-all focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-zinc-500">
                  Room invite Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                  placeholder="Enter 6-char code..."
                  maxLength={6}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-xl tracking-tighter outline-none transition-all focus:border-zinc-600"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setMode("home")}
                  className="rounded-xl bg-zinc-800 p-4 transition-all hover:bg-zinc-700 font-cinzel"
                >
                  BACK
                </button>
                <button
                  onClick={() => onJoinByCode(roomCode, name)}
                  disabled={!roomCode || !name}
                  className="flex-1 rounded-xl bg-zinc-200 p-4 text-black transition-all hover:bg-white disabled:opacity-50 font-cinzel"
                >
                  ENTER ROOM
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
