import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shuffle } from "lucide-react";
import { CAST, CAST_BY_ID, RANK_LABEL, lookOf, rankFor } from "@/lib/cast";
import { Button } from "@/components/ui/button";
import { AffectionBar } from "@/components/stat-bar";
import { Cutout } from "@/components/character-stage";
import { useAtelier } from "@/lib/store";

export const Route = createFileRoute("/bonds")({ component: Bonds });

function Bonds() {
  const navigate = useNavigate();
  const bonds = useAtelier((s) => s.bonds);
  const encounter = useAtelier((s) => s.encounter);
  const list = CAST.filter((c) => bonds[c.id]).sort(
    (a, b) => (bonds[b.id]?.affection ?? 0) - (bonds[a.id]?.affection ?? 0),
  );

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.24em] text-muted">RAISING</p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">养成</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            遇见、交谈、送礼、赴约。好感会换表情、换对白。四个人共用同一套半身脸和全身站姿。
          </p>
        </div>
        <Button
          onClick={() => {
            const id = encounter();
            if (id) void navigate({ to: "/cast/$id", params: { id } });
          }}
        >
          <Shuffle className="size-4" />
          随机邂逅
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:max-w-md">
        <Mini n={String(list.length)} l="已遇见" />
        <Mini n={String(list.filter((c) => (bonds[c.id]?.affection ?? 0) >= 60).length)} l="心动以上" />
        <Mini n={`${CAST.length - list.length}`} l="尚未遇见" />
      </div>

      {list.length === 0 ? (
        <div className="rounded-[24px] bg-surface p-8 text-center shadow-[var(--shadow-border)]">
          <p className="font-serif text-xl">还没有羁绊</p>
          <p className="mt-2 text-sm text-muted">去图鉴里点开一位，按「遇见」。</p>
          <Link to="/" className="mt-4 inline-block text-sm text-rose">
            打开图鉴
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((c) => {
            const b = bonds[c.id]!;
            const rank = rankFor(b.affection);
            return (
              <li key={c.id}>
                <Link
                  to="/cast/$id"
                  params={{ id: c.id }}
                  className="flex gap-3 overflow-hidden rounded-[24px] bg-surface p-3 shadow-[var(--shadow-border)]"
                >
                  <div className="checker relative h-28 w-20 shrink-0 overflow-hidden rounded-[16px]">
                    <div className="absolute inset-x-0 -bottom-2 top-0 flex justify-center">
                      <Cutout src={lookOf(c).src} alt={c.name} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-serif text-lg">{c.name}</p>
                      <span className="text-[11px] text-rose">{RANK_LABEL[rank]}</span>
                    </div>
                    <p className="truncate text-xs text-muted">{c.job}</p>
                    <div className="mt-3">
                      <AffectionBar value={b.affection} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-soft">
                      {CAST_BY_ID[c.id]?.lines[rank]}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function Mini({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-[20px] bg-surface px-3 py-4 text-center shadow-[var(--shadow-border)]">
      <div className="font-serif text-2xl tabular-nums">{n}</div>
      <div className="text-[11px] text-muted">{l}</div>
    </div>
  );
}
