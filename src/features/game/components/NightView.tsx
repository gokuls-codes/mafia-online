import { AnimatePresence, motion } from "framer-motion";
import {
  Moon,
  Search,
  ShieldOff,
  Skull,
} from "lucide-react";
import { useEffect, useState } from "react";

import { RoleRevealBadge } from "@/features/game/components/RoleRevealBadge";
import {
  getRole,
  hasNightAction,
  isMafiaRole,
  isSavingRole,
} from "@/features/game/lib/roles";
import { useGame } from "@/store/GameContext";

const NIGHT_OVERVIEW_ROLES = ["syndicate", "doctor", "detective", "police", "mayor"];

function getActionPrompt(roleId?: string) {
  switch (roleId) {
    case "doctor":
      return "WHO WILL YOU SAVE FROM THE MAFIA TONIGHT?";
    case "mafia":
    case "godfather":
      return "WHO MUST BE ELIMINATED BY THE FAMILY?";
    case "detective":
      return "WHO WILL YOU SCRUTINIZE FOR SUSPICIOUS ACTIVITY?";
    case "police":
      return "WHO WILL YOU PASS JUDGEMENT UPON?";
    case "mayor":
      return "WHO WILL YOU GRANT AN EXECUTIVE PARDON?";
    default:
      return "SLEEP WELL... IF YOU CAN.";
  }
}

export function NightView() {
  const { room, players, me, performAction, confirmMafiaTarget, nextPhase } =
    useGame();
  const [showOverview, setShowOverview] = useState(false);
  const [canShowOverview, setCanShowOverview] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCanShowOverview(true);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!room || !me) {
    return null;
  }

  const role = getRole(me.roleId);
  const isCurrentPlayerMafia = isMafiaRole(me.roleId);
  const currentRoleCanSave = isSavingRole(me.roleId);
  const isDead = !me.isAlive;
  const hasAction = !isDead && hasNightAction(me.roleId);
  const isDetectiveLocked =
    me.roleId?.toLowerCase() === "detective" && Boolean(me.actionTarget);
  const activeTargetId = isCurrentPlayerMafia
    ? room.mafia_target || me.actionTarget
    : me.actionTarget;
  const targetPlayer = players.find((player) => player.id === activeTargetId);
  const targetName = targetPlayer?.name;
  const otherPlayers = players.filter((player) => {
    const isSelf = player.id === me.id;

    if (isSelf) {
      return currentRoleCanSave && player.isAlive;
    }

    return player.isAlive;
  });
  const isActionLocked = Boolean(
    (isCurrentPlayerMafia && room.mafia_target) ||
      (me.actionTarget && !isCurrentPlayerMafia),
  );

  let detectiveResult: "MAFIA" | "VILLAGER" | null = null;

  if (targetPlayer && me.roleId === "detective") {
    const isMafiaFaction = targetPlayer.faction === "Mafia";
    const isGodfather = targetPlayer.roleId === "godfather";
    const isInnocentRole = targetPlayer.roleId === "innocent";

    detectiveResult =
      (isMafiaFaction && !isGodfather) || isInnocentRole ? "MAFIA" : "VILLAGER";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-12 p-8"
    >
      <div className="space-y-4 text-center">
        <h2 className="animate-pulse text-5xl tracking-[0.2em] text-zinc-500 font-cinzel">
          NIGHT FALLS
        </h2>
        <p className="text-sm uppercase tracking-widest text-zinc-600 font-outfit">
          Operation: Silence
        </p>
      </div>

      <div
        className={`grid grid-cols-1 items-start gap-8 ${
          hasAction ? "md:grid-cols-2" : ""
        }`}
      >
        <div
          className={`group relative overflow-hidden rounded-3xl border border-accent/20 p-8 glass ${
            !hasAction ? "mx-auto max-w-xl" : ""
          }`}
        >
          <div className="absolute inset-0 bg-accent/5 opacity-20 transition-opacity group-hover:opacity-30" />
          <div className="relative z-10 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Your Secret Identity
              </span>
              <h3 className="mt-1 text-4xl text-accent font-cinzel">
                {role?.name || "CITIZEN"}
              </h3>
              {me.isAlive === false && (
                <div className="mt-2 flex w-fit items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1">
                  <Skull className="h-3 w-3 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-cinzel">
                    DECEASED
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              {role?.description}
            </p>
            {me.isAlive && (
              <div className="border-t border-white/5 pt-6 text-xl text-zinc-300 font-cinzel">
                {isDetectiveLocked
                  ? "INVESTIGATION COMPLETE"
                  : isCurrentPlayerMafia && room.mafia_target
                    ? "STRIKE COORDINATED"
                    : getActionPrompt(me.roleId)}
              </div>
            )}

            {activeTargetId && (
              <div className="space-y-3">
                <div
                  className={`relative rounded-xl border p-4 text-center font-bold ${
                    currentRoleCanSave
                      ? "border-green-500/30 bg-green-500/10 text-green-500"
                      : "border-accent/30 bg-accent/10 text-accent"
                  }`}
                >
                  {isDetectiveLocked
                    ? "FILE CLOSED: "
                    : isCurrentPlayerMafia && room.mafia_target
                      ? "STRIKE FINALIZED: "
                      : isCurrentPlayerMafia
                        ? "YOUR PREFERENCE: "
                        : "TARGET: "}
                  {targetName}
                  {isCurrentPlayerMafia && room.mafia_target && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity }}
                      className="absolute -top-3 -right-3 rounded-full bg-accent px-2 py-1 text-[8px] font-black text-white ring-4 ring-black"
                    >
                      LOCKED
                    </motion.div>
                  )}
                </div>

                {isCurrentPlayerMafia && activeTargetId && !room.mafia_target && (
                  <button
                    onClick={() => confirmMafiaTarget(activeTargetId)}
                    className="w-full rounded-xl bg-accent p-4 text-white transition-transform hover:scale-105 font-cinzel shadow-red"
                  >
                    CONFIRM SYNDICATE HIT
                  </button>
                )}

                {detectiveResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border p-4 text-center text-sm font-cinzel ${
                      detectiveResult === "MAFIA"
                        ? "border-red-500/50 bg-red-950/20 text-red-500"
                        : "border-green-500/50 bg-green-950/20 text-green-500"
                    }`}
                  >
                    REVEAL: {detectiveResult}
                  </motion.div>
                )}
              </div>
            )}

            {!hasAction && (
              <div className="space-y-6 pt-8">
                {isDead ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 italic text-zinc-600">
                      <Skull className="h-12 w-12 animate-pulse text-red-500/20" />
                      <p className="text-center text-xl uppercase tracking-[0.3em] text-red-500/30 font-cinzel">
                        THE VEIL IS LIFTED
                      </p>
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-6">
                      <h4 className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Ghost Revelation
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between rounded-xl p-3 px-4 py-1 glass"
                          >
                            <span
                              className={`text-sm font-outfit ${
                                player.isAlive
                                  ? "text-zinc-300"
                                  : "text-zinc-600 line-through"
                              }`}
                            >
                              {player.name}
                            </span>
                            <RoleRevealBadge player={player} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 italic text-zinc-600">
                    <Moon className="h-12 w-12 opacity-20" />
                    <p className="text-center text-zinc-400">
                      The city sleeps, but the shadows are moving. Try to make it
                      to morning.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {hasAction && (
          <div className="space-y-4">
            <h4 className="px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Potential Targets
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {otherPlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => hasAction && !isActionLocked && performAction(player.id)}
                  disabled={
                    !hasAction ||
                    isActionLocked ||
                    (currentRoleCanSave && me.lastActionTarget === player.id)
                  }
                  className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all ${
                    activeTargetId === player.id
                      ? currentRoleCanSave
                        ? "border-green-500 bg-green-600 text-white"
                        : "border-accent bg-accent text-white"
                      : "border-white/5 text-zinc-400 glass hover:border-zinc-500"
                  } disabled:opacity-50`}
                >
                  <div className="translate-y-0.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-2 px-2 py-1 text-lg font-outfit">
                        {player.name}
                        <RoleRevealBadge player={player} />
                      </span>
                      {currentRoleCanSave && me.lastActionTarget === player.id && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tighter text-zinc-500">
                          Cooldown
                        </span>
                      )}
                    </div>
                    {isCurrentPlayerMafia && (
                      <div className="mt-1 flex gap-1">
                        {players
                          .filter(
                            (candidate) =>
                              isMafiaRole(candidate.roleId) &&
                              candidate.actionTarget === player.id,
                          )
                          .map((candidate) => (
                            <div
                              key={candidate.id}
                              className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-tighter ${
                                candidate.id === me.id
                                  ? "bg-white text-black"
                                  : "bg-red-800 text-white opacity-70"
                              }`}
                            >
                              {candidate.id === me.id
                                ? "YOU"
                                : candidate.name.split(" ")[0]}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <Search
                    className={`h-4 w-4 transition-opacity ${
                      activeTargetId === player.id
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </button>
              ))}

              {isActionLocked && (
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {me.actionTarget === "skip"
                    ? "Decision: Stay Hidden (Action Skipped)"
                    : "Choice is locked for the night"}
                </div>
              )}

              {me.roleId?.toLowerCase() === "police" &&
                !isActionLocked &&
                me.isAlive && (
                  <button
                    onClick={() => performAction("skip")}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-800 p-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-all hover:border-accent/40 hover:text-zinc-300"
                  >
                    <ShieldOff className="h-4 w-4 transition-colors group-hover:text-accent" />
                    Stay Hidden (Skip Night Action)
                  </button>
                )}
            </div>
          </div>
        )}
      </div>

      {me.isHost && (
        <div className="space-y-8 pt-12">
          <div className="flex flex-col items-center justify-center gap-4">
            {canShowOverview ? (
              <button
                onClick={() => setShowOverview((current) => !current)}
                className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-accent transition-all hover:bg-accent/20 shadow-red"
              >
                <Search className="h-4 w-4" />
                {showOverview ? "Disconnect Overview" : "Infiltrate Tactical Overview"}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3 opacity-40">
                <div className="relative h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                    className="absolute top-0 h-full w-full bg-accent"
                  />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                  Decrypting Shadows...
                </span>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showOverview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/5 p-6 glass shadow-red">
                  <h4 className="border-b border-white/5 pb-2 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Night Tactical Overview
                  </h4>
                  <div className="space-y-3">
                    {NIGHT_OVERVIEW_ROLES.map((type) => {
                      let totalWithRole = 0;
                      let readyCount = 0;
                      let label = "";

                      if (type === "syndicate") {
                        const mafiaAssigned = players.filter((player) =>
                          isMafiaRole(player.roleId),
                        );

                        if (mafiaAssigned.length === 0) {
                          return null;
                        }

                        const allMafiaDead = mafiaAssigned.every(
                          (player) => !player.isAlive,
                        );

                        totalWithRole = 1;
                        readyCount = room.mafia_target || allMafiaDead ? 1 : 0;
                        label = "The Syndicate";
                      } else {
                        const roleAssigned = players.filter(
                          (player) => player.roleId === type,
                        );

                        if (roleAssigned.length === 0) {
                          return null;
                        }

                        totalWithRole = roleAssigned.length;
                        readyCount = roleAssigned.filter(
                          (player) => !player.isAlive || player.actionTarget,
                        ).length;
                        label = getRole(type)?.name || "CITIZEN";
                      }

                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between rounded-lg bg-black/20 p-2"
                        >
                          <span className="text-sm text-zinc-400 font-cinzel">
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
                              <div
                                className={`h-full transition-all ${
                                  readyCount === totalWithRole
                                    ? "bg-green-500/80"
                                    : "bg-accent/80"
                                }`}
                                style={{
                                  width: `${(readyCount / totalWithRole) * 100}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                readyCount === totalWithRole
                                  ? "text-green-500"
                                  : "text-zinc-500"
                              }`}
                            >
                              {readyCount} / {totalWithRole}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center">
            <button
              onClick={nextPhase}
              className="rounded-full bg-zinc-100 px-12 py-4 text-lg text-black transition-all hover:bg-white font-cinzel shadow-xl shadow-white/5"
            >
              BRING THE DAWN
            </button>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-zinc-600">
              Only the host can end the night
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
