import { HelpCircle, Skull, Users } from "lucide-react";
import { motion } from "framer-motion";

import { RoleRevealBadge } from "@/features/game/components/RoleRevealBadge";
import { useGame } from "@/store/GameContext";

export function DayView() {
  const { room, players, me, nextPhase } = useGame();

  if (!room || !me) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-12 p-8"
    >
      <div className="space-y-4 text-center">
        <h2 className="text-5xl tracking-[0.2em] text-accent font-cinzel">
          DAY BREAK
        </h2>
        <p className="text-sm uppercase tracking-widest text-zinc-500 font-outfit">
          Discussion & Debate
        </p>
      </div>

      <div className="rounded-3xl border border-white/5 bg-accent/5 p-8 glass backdrop-blur-md">
        <div className="mb-4 flex items-center gap-4">
          <Skull className="h-8 w-8 text-accent" />
          <h3 className="text-2xl font-cinzel">The Morning Report</h3>
        </div>
        <p className="text-xl italic leading-relaxed text-zinc-300 font-outfit">
          "{room.last_night_summary?.message || "The city wakes up to a quiet dawn..."}"
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Survivor Status
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-2xl border p-4 glass ${
                  player.isAlive
                    ? "border-white/5 opacity-100"
                    : "border-red-900/50 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      player.isAlive
                        ? "bg-zinc-800"
                        : "bg-red-900/20 text-red-500"
                    }`}
                  >
                    {player.isAlive ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <Skull className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`flex items-center gap-2 text-lg font-outfit ${
                      player.isAlive
                        ? "text-zinc-200"
                        : "text-zinc-500 line-through"
                    }`}
                  >
                    {player.name}
                    <RoleRevealBadge player={player} />
                  </span>
                </div>
                {!player.isAlive && (
                  <span className="rounded-md border border-red-500/20 bg-red-900/30 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-red-500">
                    Deceased
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/5 p-8 glass">
          <div className="space-y-4 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-zinc-700" />
            <p className="text-sm italic text-zinc-400">
              Discuss with your fellow citizens. Who among you hides the shadow
              of the mafia? Use your intuition to find the suspects.
            </p>
          </div>

          {me.isHost && (
            <button
              onClick={nextPhase}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 text-lg text-white transition-all hover:bg-accent-muted font-cinzel shadow-lg shadow-red-900/20"
            >
              CALL FOR A VOTE
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
