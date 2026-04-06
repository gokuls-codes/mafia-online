export const RULE_SECTIONS = [
  {
    title: "THE NIGHT PHASE",
    body: "When the shadows fall, special roles awaken. The Mafia coordinates their strike, while the Town's protectors use their secret abilities to save or investigate.",
  },
  {
    title: "THE DAY BREAK",
    body: "The city wakes to find who survived. Survivors discuss, debate, and attempt to uncover the hidden threats within their midst.",
  },
  {
    title: "VOTING & VERDICT",
    body: "The Town chooses a suspect for execution. If a majority is reached, the suspect is sent to the gallows. Choose wisely, once dead, there is no return.",
  },
] as const;

export const VICTORY_CONDITIONS = [
  {
    title: "Town",
    body: "Eliminate all Mafia and Serial Killer threats to restore order.",
    className: "text-green-500",
  },
  {
    title: "Mafia",
    body: "Outnumber or match the living Town members to claim the city.",
    className: "text-red-500",
  },
  {
    title: "Serial Killer",
    body: "Be the absolute last one alive to reach ultimate carnage.",
    className: "text-fuchsia-500",
  },
  {
    title: "Jester",
    body: "Deceive the Town into voting for your execution to win the stage.",
    className: "text-orange-500",
  },
] as const;
