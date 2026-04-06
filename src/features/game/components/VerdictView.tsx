import { motion } from "framer-motion";
import { Shield } from "lucide-react";

import { useGame } from "@/store/GameContext";

export function VerdictView() {
  const { room, me, nextPhase } = useGame();

  if (!room || !me) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[60vh] flex-col justify-center space-y-12 p-8 mx-auto max-w-4xl"
    >
      <div className="space-y-4 text-center">
        <Shield className="mx-auto mb-4 h-20 w-20 text-zinc-600" />
        <h2 className="text-5xl tracking-[0.2em] text-accent font-cinzel">
          THE TOWN'S VERDICT
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[3xl] border border-white/5 bg-accent/5 p-12 glass shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
        <p className="text-center text-3xl italic leading-relaxed text-zinc-200 font-outfit">
          "{room.last_vote_summary?.message || "The crowd disperses in silence..."}"
        </p>
      </div>

      {me.isHost && (
        <div className="pt-8 text-center">
          <button
            onClick={nextPhase}
            className="rounded-full bg-zinc-100 px-16 py-5 text-xl text-black transition-all hover:bg-white font-cinzel shadow-2xl shadow-white/5"
          >
            COMMENCE NIGHTFALL
          </button>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            Only the host can proceed to the shadows
          </p>
        </div>
      )}
    </motion.div>
  );
}
