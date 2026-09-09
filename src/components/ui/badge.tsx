import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Rarity } from "@/lib/cast";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 text-[11px] tracking-wide font-medium rounded-full bg-paper-2 text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}

const RARITY_CLASS: Record<Rarity, string> = {
  N: "bg-paper-2 text-muted",
  R: "bg-ink/10 text-ink-soft",
  SR: "bg-ink text-paper",
  SSR: "bg-rose text-rose-fg",
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return <Badge className={RARITY_CLASS[rarity]}>{rarity}</Badge>;
}
