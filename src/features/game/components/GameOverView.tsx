import { motion } from "framer-motion";
import { Skull, Zap } from "lucide-react";

import { useGame } from "@/store/GameContext";
import { getRole } from "@/features/game/lib/roles";

export function GameOverView() {
  const { room, players, me, nextPhase } = useGame();

  if (!room || !me) {
    return null;
  }

  const winner = room.winnerFaction;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-4xl space-y-12 p-8 text-center"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Skull
            className={`mx-auto mb-4 h-20 w-20 ${
              winner === "Mafia"
                ? "text-red-500"
                : winner === "Jester"
                  ? "text-fuchsia-500"
                  : "text-green-500"
            }`}
          />
          <h1 className="text-7xl font-black tracking-tighter drop-shadow-2xl font-cinzel">
            {winner?.toUpperCase()} VICTORIOUS
          </h1>
        </motion.div>
        <p className="text-xl uppercase tracking-[0.3em] text-zinc-400 font-outfit">
          {winner === "Town"
            ? "Justice has been served."
            : winner === "Jester"
              ? "The joke is on you."
              : "The city has fallen into darkness."}
        </p>
      </div>

      <div className="space-y-6 rounded-3xl border border-white/5 p-8 glass">
        <h3 className="border-b border-white/5 pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          The Final Reveal
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {players.map((player) => {
            const didWin = player.faction === winner;
            const role = getRole(player.roleId);

            return (
              <div
                key={player.id}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                  didWin
                    ? "border-accent/40 bg-accent/10 shadow-[0_0_25px_-5px_rgba(255,0,0,0.3)]"
                    : "border-white/5 bg-black/40 opacity-80"
                }`}
              >
                {didWin && (
                  <div className="absolute top-0 right-0 rounded-bl-lg bg-accent p-1.5 text-[8px] font-black uppercase tracking-widest text-white">
                    Victor
                  </div>
                )}
                <div className="text-left">
                  <div
                    className={`text-lg font-bold font-outfit ${
                      didWin ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {player.name}
                  </div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      player.faction === "Mafia" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {role?.name || "VILLAGER"}
                  </div>
                </div>
                <div className="flex items-end justify-between pt-4">
                  <div className="text-[10px] font-bold uppercase text-zinc-500">
                    {player.isAlive ? "Survived" : "Eliminated"}
                  </div>
                  {didWin ? (
                    <Zap className="h-4 w-4 animate-pulse fill-accent text-accent" />
                  ) : (
                    <Skull className="h-4 w-4 text-zinc-800" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {me.isHost && (
        <button
          onClick={nextPhase}
          className="mx-auto flex items-center justify-center gap-4 rounded-2xl bg-zinc-100 px-12 py-6 text-2xl text-black transition-all hover:bg-white font-cinzel shadow-2xl"
        >
          RETURN TO LOBBY
        </button>
      )}
    </motion.div>
  );
}
