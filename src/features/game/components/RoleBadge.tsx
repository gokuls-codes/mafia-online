import { getRole } from "@/features/game/lib/roles";

type RoleBadgeProps = {
  roleId: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canEdit: boolean;
};

export function RoleBadge({
  roleId,
  count,
  onIncrement,
  onDecrement,
  canEdit,
}: RoleBadgeProps) {
  const role = getRole(roleId);

  if (!role) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 p-4 glass">
      <div className="flex flex-col">
        <span className="flex items-center gap-2 text-lg font-cinzel">
          {role.name}
        </span>
        <span className="text-xs text-zinc-500">{role.description}</span>
      </div>
      <div className="flex items-center gap-4">
        {canEdit && (
          <button
            onClick={onDecrement}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-600"
          >
            -
          </button>
        )}
        <span className="text-xl font-bold font-cinzel">{count}</span>
        {canEdit && (
          <button
            onClick={onIncrement}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-600"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
