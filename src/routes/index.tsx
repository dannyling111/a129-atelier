import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CAST, lookOf } from "@/lib/cast";
import { poseSrc } from "@/lib/looks";
import { asset } from "@/lib/asset";
import { RarityBadge, Badge } from "@/components/ui/badge";
import { Cutout } from "@/components/character-stage";
import { cn } from "@/lib/cn";
import { useAtelier } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Gallery });

function Gallery() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<"all" | "f" | "m">("all");
  const favorites = useAtelier((s) => s.favorites);
  const bonds = useAtelier((s) => s.bonds);
  const meet = useAtelier((s) => s.meet);

  const list = useMemo(
    () => CAST.filter((c) => (gender === "all" ? true : c.gender === gender)),
    [gender],
  );
  const featured = CAST.find((c) => c.id === "nanfeng") ?? CAST[0]!;

  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Link
          to="/cast/$id"
          params={{ id: featured.id }}
          className="group relative overflow-hidden rounded-[28px] bg-paper-2 min-h-[420px] sm:min-h-[560px]"
        >
          <img
            src={asset("backgrounds/sakura.jpg")}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 top-[4%] flex items-end justify-center">
            <Cutout src={poseSrc(featured.lookId, "stand")} alt={featured.name} />
          </div>
          <div className="absolute inset-x-4 bottom-4 z-10 rounded-[20px] bg-surface/92 p-4 backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5">
            <div className="mb-1 flex items-center gap-2 text-[11px] tracking-[0.2em] text-muted uppercase">
              主线角色
              <RarityBadge rarity={featured.rarity} />
            </div>
            <h1 className="font-serif text-3xl tracking-tight">{featured.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">{featured.faces.talk}</p>
          </div>
        </Link>

        <div className="flex flex-col gap-6 rounded-[28px] bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8 lg:self-start">
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.28em] text-muted">ATELIER · 4 LEADS</p>
            <h2 className="font-serif text-4xl leading-[1.15] tracking-tight sm:text-5xl">
              四人馆
              <br />
              半身推剧情
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              两女两男，同一套立绘模板。全身只留自然站姿与侧身；半身六种表情用来对白、送礼、赴约。不再堆人，也不再张开双手站着。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat n="4" l="角色" />
            <Stat n="2" l="全身站姿" />
            <Stat n="6" l="半身表情" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CAST.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  meet(c.id);
                  void navigate({ to: "/cast/$id", params: { id: c.id } });
                }}
                className={cn(
                  "h-11 rounded-full px-4 text-sm",
                  "bg-paper-2 text-ink-soft hover:bg-paper-3",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Chip active={gender === "all"} onClick={() => setGender("all")}>
            全部
          </Chip>
          <Chip active={gender === "f"} onClick={() => setGender("f")}>
            女性
          </Chip>
          <Chip active={gender === "m"} onClick={() => setGender("m")}>
            男性
          </Chip>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {list.map((c) => {
            const look = lookOf(c);
            return (
              <Link
                key={c.id}
                to="/cast/$id"
                params={{ id: c.id }}
                className="group overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-border)] transition-[transform] duration-200 hover:-translate-y-0.5"
              >
                <div className="checker relative aspect-[3/4]">
                  <div className="absolute inset-x-0 bottom-0 top-2 flex justify-center">
                    <Cutout src={poseSrc(c.lookId, "idle")} alt={c.name} />
                  </div>
                  <div className="absolute left-2 top-2">
                    <RarityBadge rarity={c.rarity} />
                  </div>
                  {favorites.includes(c.id) ? (
                    <Heart className="absolute right-2 top-2 size-4 fill-rose text-rose" />
                  ) : null}
                </div>
                <div className="space-y-1 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-lg leading-tight">{c.name}</p>
                    <Badge>{c.gender === "f" ? "女" : "男"}</Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {look.titleZh} · {c.job}
                  </p>
                  <p className="text-[11px] text-faint">
                    {bonds[c.id] ? "已遇见" : "未遇见"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-[16px] bg-paper-2 px-2 py-3">
      <div className="font-serif text-2xl tabular-nums">{n}</div>
      <div className="text-[11px] text-muted">{l}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full px-3 text-xs transition-colors duration-150",
        active ? "bg-ink text-paper" : "bg-paper-2 text-ink-soft hover:bg-paper-3",
      )}
    >
      {children}
    </button>
  );
}
