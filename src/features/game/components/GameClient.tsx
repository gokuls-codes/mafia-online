"use client";

import { GameShell } from "@/features/game/components/GameShell";
import { GameProvider } from "@/store/GameContext";

export function GameClient() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
