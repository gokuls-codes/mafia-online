import { HelpCircle, Info, Zap } from "lucide-react";
import { useState } from "react";

import { SidePanel } from "@/components/ui/SidePanel";
import {
  RULE_SECTIONS,
  VICTORY_CONDITIONS,
} from "@/features/game/constants/panels";
import { GamePhaseView } from "@/features/game/components/GamePhaseView";
import { PlayerIdentity } from "@/features/game/components/PlayerIdentity";
import { useGame } from "@/store/GameContext";
import { ROLES } from "@/types/game";

type ActivePanel = "rules" | "roles" | null;

function getPhaseBackground(status?: string) {
  const isNight = status === "Night";
  const isDay = ["Day", "Voting", "Verdict"].includes(status || "");
  const isFinished = status === "Finished";

  const backgroundColor = isNight ? "#020203" : isDay ? "#121218" : "#0a0a0a";
  const gradientColor = isNight
    ? "rgba(255, 0, 0, 0.2)"
    : isDay
      ? "rgba(255, 200, 50, 0.12)"
      : isFinished
        ? "rgba(0, 255, 120, 0.12)"
        : "rgba(255, 0, 0, 0.08)";

  return { backgroundColor, gradientColor, isNight, isDay };
}

export function GameShell() {
  const { room } = useGame();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const { backgroundColor, gradientColor, isNight, isDay } = getPhaseBackground(
    room?.status,
  );

  return (
    <div
      className="flex min-h-screen flex-col text-foreground transition-all duration-1000 ease-in-out"
      style={{
        backgroundColor,
        backgroundImage: `radial-gradient(circle at 50% -10%, ${gradientColor}, transparent 70%)`,
      }}
    >
      <SidePanel
        isOpen={activePanel === "rules"}
        onClose={() => setActivePanel(null)}
        title="Rules"
      >
        <div className="space-y-8 text-zinc-300 font-outfit">
          {RULE_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-3">
              <h3 className="flex items-center gap-2 text-lg text-accent font-cinzel">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {section.body}
              </p>
            </section>
          ))}

          <section className="space-y-4 border-t border-white/5 pt-4">
            <h3 className="text-xl text-zinc-200 font-cinzel">
              VICTORY CONDITIONS
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {VICTORY_CONDITIONS.map((condition) => (
                <div key={condition.title} className="rounded-xl p-4 glass">
                  <h4
                    className={`mb-1 text-xs font-bold uppercase tracking-widest ${condition.className}`}
                  >
                    {condition.title}
                  </h4>
                  <p className="text-xs text-balance text-zinc-500">
                    {condition.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SidePanel>

      <SidePanel
        isOpen={activePanel === "roles"}
        onClose={() => setActivePanel(null)}
        title="Roles"
      >
        <div className="grid grid-cols-1 gap-4 text-zinc-300 font-outfit">
          {Object.values(ROLES).map((role) => (
            <div
              key={role.id}
              className="group rounded-2xl border border-white/5 p-6 glass transition-all duration-300 hover:border-accent/30"
            >
              <div className="mb-3 flex items-center justify-between text-zinc-100">
                <h3 className="text-xl text-zinc-200 transition-colors group-hover:text-accent font-cinzel">
                  {role.name}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                    role.faction === "Mafia"
                      ? "bg-red-500/20 text-red-500"
                      : role.faction === "Town"
                        ? "bg-accent/20 text-accent"
                        : "bg-fuchsia-500/20 text-fuchsia-500"
                  }`}
                >
                  {role.faction}
                </span>
              </div>
              <p className="mb-4 text-[13px] leading-relaxed text-zinc-400">
                {role.description}
              </p>
              <div className="flex items-start gap-2 border-t border-white/5 pt-4 opacity-80">
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <p className="text-[11px] italic leading-snug text-zinc-500">
                  {role.powerDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SidePanel>

      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-white/5 bg-background/80 p-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-accent font-bold text-white font-cinzel shadow-red">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-widest leading-none font-cinzel">
              MAFIA
            </span>
            <span className="text-[8px] font-bold tracking-[0.3em] text-zinc-500">
              ONLINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={() => setActivePanel("rules")}
              className="group flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-6 py-2.5 transition-all hover:bg-white/10"
            >
              <HelpCircle className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold tracking-widest text-zinc-300 font-cinzel">
                RULES
              </span>
            </button>
            <button
              onClick={() => setActivePanel("roles")}
              className="group flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-6 py-2.5 transition-all hover:bg-white/10"
            >
              <Info className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold tracking-widest text-zinc-300 font-cinzel">
                ROLES
              </span>
            </button>
          </div>
          <PlayerIdentity />
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-[50%] -left-[20%] h-full w-full rounded-full blur-[120px] transition-all duration-1000 ${
              isNight ? "bg-red-900/10" : isDay ? "bg-amber-900/10" : "bg-accent/5"
            } animate-pulse-slow`}
          />
          <div className="absolute -right-[20%] -bottom-[50%] h-full w-full rounded-full bg-zinc-800/10 blur-[120px]" />
        </div>

        <GamePhaseView />
      </main>
    </div>
  );
}
