import { AnimatePresence, motion } from "framer-motion";
import { Clock, ShieldOff, Skull } from "lucide-react";

import { RoleRevealBadge } from "@/features/game/components/RoleRevealBadge";
import { useCountdown } from "@/features/game/hooks/use-countdown";
import { useGame } from "@/store/GameContext";

const VOTE_TIMER_DURATION = 120;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function VotingView() {
  const { room, players, me, voteForPlayer, nextPhase } = useGame();
  const timeLeft = useCountdown(VOTE_TIMER_DURATION);

  if (!room || !me) {
    return null;
  }

  const alivePlayers = players.filter((player) => player.isAlive);
  const myVote = me.voteTarget;
  const isDead = !me.isAlive;
  const skipVoteCount = players.filter((player) => player.voteTarget === "skip").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-12 p-8"
    >
      <div className="space-y-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-5xl tracking-[0.2em] text-red-500 font-cinzel">
            THE VERDICT
          </h2>
          <div className="mt-2 flex items-center gap-3 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5">
            <Clock
              className={`h-4 w-4 text-red-500 ${timeLeft < 20 ? "animate-pulse" : ""}`}
            />
            <span className="font-mono text-xl font-bold tracking-widest text-red-500">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <p className="translate-y-2 text-sm uppercase tracking-widest text-zinc-500 font-outfit">
          Cast your judgment
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="px-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Casting Ballot
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {[...alivePlayers]
              .sort((left, right) => left.name.localeCompare(right.name))
              .map((player) => {
                const votersForThisPlayer = alivePlayers.filter(
                  (voter) => voter.voteTarget === player.id,
                );
                const voteCount = votersForThisPlayer.length;

                return (
                  <button
                    key={player.id}
                    onClick={() => !isDead && voteForPlayer(player.id)}
                    disabled={isDead}
                    className={`group relative flex min-h-[85px] items-center justify-between overflow-hidden rounded-2xl border p-5 transition-all ${
                      myVote === player.id
                        ? "border-red-400 bg-red-500 text-white shadow-lg shadow-red-900/40"
                        : "border-white/5 text-zinc-400 glass hover:border-zinc-500"
                    } disabled:opacity-50`}
                  >
                    <div className="max-w-[70%] translate-y-0.5 text-left">
                      <span className="flex w-full items-center gap-3 truncate text-xl font-medium font-outfit">
                        {player.name}
                        <RoleRevealBadge player={player} />
                      </span>
                      <div className="mt-2 flex min-h-[22px] flex-wrap gap-1">
                        {votersForThisPlayer.map((voter) => (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            key={voter.id}
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter ${
                              voter.id === me.id
                                ? "bg-white text-black"
                                : myVote === player.id
                                  ? "bg-black/20 text-white"
                                  : "bg-black/40 text-white/70"
                            }`}
                          >
                            {voter.id === me.id ? "YOU" : voter.name.split(" ")[0]}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="flex min-w-[50px] flex-col items-end">
                      <AnimatePresence mode="popLayout">
                        {voteCount > 0 ? (
                          <motion.div
                            key={`count-${player.id}-${voteCount}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-end"
                          >
                            <span className="text-3xl font-bold leading-none font-cinzel">
                              {voteCount}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                              Votes
                            </span>
                          </motion.div>
                        ) : (
                          <div className="h-[42px]" />
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}

            <button
              onClick={() => !isDead && voteForPlayer("skip")}
              disabled={isDead}
              className={`group relative mt-2 flex min-h-[85px] items-center justify-between overflow-hidden rounded-2xl border p-5 transition-all ${
                myVote === "skip"
                  ? "border-zinc-200 bg-zinc-100 text-black shadow-lg"
                  : "border-white/5 text-zinc-400 glass hover:border-zinc-500"
              } disabled:opacity-50`}
            >
              <div className="max-w-[70%] translate-y-0.5 text-left">
                <span className="truncate text-xl font-medium font-outfit">
                  Abstain / No Conviction
                </span>
                <div className="mt-2 flex min-h-[22px] flex-wrap gap-1">
                  {players
                    .filter((player) => player.voteTarget === "skip")
                    .map((player) => (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={player.id}
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter ${
                          player.id === me.id
                            ? myVote === "skip"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                            : myVote === "skip"
                              ? "bg-black/20 text-black"
                              : "bg-white/10 text-zinc-500"
                        }`}
                      >
                        {player.id === me.id ? "YOU" : player.name.split(" ")[0]}
                      </motion.span>
                    ))}
                </div>
              </div>

              <div className="flex min-w-[50px] flex-col items-end">
                {skipVoteCount > 0 && (
                  <div
                    className={`text-3xl font-bold leading-none font-cinzel ${
                      myVote === "skip" ? "text-black" : "text-zinc-500"
                    }`}
                  >
                    {skipVoteCount}
                  </div>
                )}
                <ShieldOff
                  className={`h-5 w-5 ${
                    myVote === "skip" ? "text-black" : "opacity-20 group-hover:opacity-100"
                  }`}
                />
              </div>
            </button>
          </div>
          {isDead && (
            <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-center text-sm italic text-red-400">
              The dead have no voice in the city's judgment.
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-6 rounded-3xl border border-white/5 bg-red-950/5 p-8 glass">
            <Skull className="mx-auto h-12 w-12 text-red-500 opacity-50" />
            <div className="space-y-2 text-center">
              <h4 className="text-xl font-cinzel">THE GALLOWS AWAIT</h4>
              <p className="text-sm leading-relaxed text-zinc-500">
                Select the person you believe is working for the Mafia. If there
                is a majority, they will be executed at sunset.
              </p>
            </div>
          </div>

          {me.isHost && (
            <div className="space-y-4">
              <button
                onClick={nextPhase}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-6 text-2xl text-white transition-all hover:bg-red-500 font-cinzel shadow-xl shadow-red-900/40"
              >
                FINALIZE VERDICT
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Host Power: Tally the votes and end the day
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
