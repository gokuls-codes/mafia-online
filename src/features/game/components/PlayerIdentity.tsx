import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";

import { useGame } from "@/store/GameContext";
import { getRole } from "@/features/game/lib/roles";

export function PlayerIdentity() {
  const { me, room } = useGame();

  if (!me) {
    return null;
  }

  const role = getRole(me.roleId);
  const isLobby = room?.status === "Lobby";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 backdrop-blur-sm"
    >
      <div className="flex flex-col items-end">
        <span className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-zinc-500">
          Your Identity
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium font-outfit text-zinc-200">
            {me.name}
          </span>
          {role && !isLobby && (
            <>
              <div className="h-1 w-1 rounded-full bg-zinc-700" />
              <span
                className={`text-xs font-bold font-cinzel ${
                  role.faction === "Mafia" ? "text-red-500" : "text-accent"
                }`}
              >
                {role.name}
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
          role?.faction === "Mafia" && !isLobby
            ? "border-red-500/30 bg-red-950/30 text-red-500"
            : "border-white/10 bg-zinc-800 text-zinc-400"
        }`}
      >
        {role && !isLobby ? (
          <Shield className="h-4 w-4" />
        ) : (
          <Users className="h-4 w-4" />
        )}
      </div>
    </motion.div>
  );
}
