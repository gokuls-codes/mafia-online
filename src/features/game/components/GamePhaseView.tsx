import { Skull } from "lucide-react";

import { DayView } from "@/features/game/components/DayView";
import { GameOverView } from "@/features/game/components/GameOverView";
import { LandingPage } from "@/features/game/components/LandingPage";
import { LobbyView } from "@/features/game/components/LobbyView";
import { NightView } from "@/features/game/components/NightView";
import { VerdictView } from "@/features/game/components/VerdictView";
import { VotingView } from "@/features/game/components/VotingView";
import { useGame } from "@/store/GameContext";
import { ROLES } from "@/types/game";

export function GamePhaseView() {
  const { room, me, createRoom, joinRoomByCode } = useGame();

  if (!room) {
    return <LandingPage onCreate={createRoom} onJoinByCode={joinRoomByCode} />;
  }

  switch (room.status) {
    case "Lobby":
      return <LobbyView />;
    case "Night":
      return <NightView />;
    case "Day":
      return <DayView />;
    case "Voting":
      return <VotingView />;
    case "Verdict":
      return <VerdictView />;
    case "Finished":
      return <GameOverView />;
    default:
      return (
        <div className="p-8 text-center">
          <h1 className="text-3xl text-accent font-cinzel">
            OPERATION IN PROGRESS: {room.status}
          </h1>
          <p className="mt-4">Current implementation focus: Night Actions.</p>
          <div className="mx-auto mt-8 max-w-md rounded-3xl p-8 glass">
            <h2 className="mb-4 text-2xl font-cinzel">YOUR ASSIGNMENT</h2>
            <div className="rounded-2xl border border-accent/20 bg-accent/10 p-6">
              <span className="mb-2 block text-4xl font-cinzel">
                {me?.roleId?.toUpperCase() || "STILL BREATHING"}
              </span>
              {me?.isAlive === false && (
                <div className="mx-auto mb-4 flex w-fit items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1">
                  <Skull className="h-3 w-3 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 font-cinzel">
                    DECEASED
                  </span>
                </div>
              )}
              <p className="text-sm text-zinc-400">
                {me?.roleId
                  ? ROLES[me.roleId.toUpperCase()]?.description
                  : "Wait for the host to start the game."}
              </p>
            </div>
          </div>
        </div>
      );
  }
}
