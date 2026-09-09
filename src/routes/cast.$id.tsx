import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Download, MessageCircle, Gift, Sparkles, ChevronLeft } from "lucide-react";
import { CAST_BY_ID, GIFTS, RANK_LABEL, lookOf, lineFor, rankFor } from "@/lib/cast";
import { BACKGROUNDS } from "@/lib/backgrounds";
import { Button } from "@/components/ui/button";
import { Badge, RarityBadge } from "@/components/ui/badge";
import { CharacterStage, PoseStrip } from "@/components/character-stage";
import { AffectionBar, StatBar } from "@/components/stat-bar";
import { cn } from "@/lib/cn";
import { useAtelier } from "@/lib/store";
import { downloadAsset, exportScenePng } from "@/lib/export-scene";
import { poseSrc } from "@/lib/looks";
import { RANK_FACE, type PoseId } from "@/lib/poses";

export const Route = createFileRoute("/cast/$id")({ component: CastPage });

function CastPage() {
  const { id } = Route.useParams();
  const member = CAST_BY_ID[id];
  const navigate = useNavigate();
  const bonds = useAtelier((s) => s.bonds);
  const favorites = useAtelier((s) => s.favorites);
  const talk = useAtelier((s) => s.talk);
  const gift = useAtelier((s) => s.gift);
  const invite = useAtelier((s) => s.invite);
  const meet = useAtelier((s) => s.meet);
  const toggleFavorite = useAtelier((s) => s.toggleFavorite);
  const [bgId, setBgId] = useState("studio");
  const [spoken, setSpoken] = useState<string | null>(null);
  const [pose, setPose] = useState<PoseId>("idle");

  if (!member) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl">没有这位角色</p>
        <Link to="/" className="mt-4 inline-block text-sm text-rose">
          返回图鉴
        </Link>
      </div>
    );
  }

  const look = lookOf(member);
  const bond = bonds[member.id];
  const affection = bond?.affection ?? 0;
  const rank = rankFor(affection);
  const line = spoken ?? lineFor(member, pose, rank);
  const fav = favorites.includes(member.id);

  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="inline-flex h-10 items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          图鉴
        </button>
        <CharacterStage
          member={member}
          bgId={bgId}
          line={line}
          pose={pose}
          className="aspect-[2/3] rounded-[28px]"
        />
        <PoseStrip value={pose} onChange={setPose} />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setBgId(bg.id)}
              aria-label={bg.titleZh}
              className={cn(
                "relative h-14 w-12 shrink-0 overflow-hidden rounded-[10px]",
                bgId === bg.id ? "ring-2 ring-ink" : "opacity-80",
              )}
            >
              <img src={bg.src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 lg:pt-12">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <RarityBadge rarity={member.rarity} />
            <Badge>{member.gender === "f" ? "女" : "男"}</Badge>
            <Badge>{look.titleZh}</Badge>
            <span className="text-xs tabular-nums text-muted">{member.id.toUpperCase()}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-serif text-4xl tracking-tight">{member.name}</h1>
              <p className="mt-1 text-sm text-muted">
                {member.kana} · {member.age} · {member.city} · {member.job}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(member.id)}
              className="size-11 rounded-[12px] bg-paper-2 text-rose"
              aria-label="收藏"
            >
              <Heart className={cn("mx-auto size-5", fav && "fill-rose")} />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">{member.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {member.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)] space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">养成</p>
            <span className="text-xs text-rose">{RANK_LABEL[rank]}</span>
          </div>
          <AffectionBar value={affection} />
          {!bond ? (
            <Button
              className="w-full"
              onClick={() => {
                meet(member.id);
                setSpoken(member.lines.stranger);
              }}
            >
              遇见
            </Button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="paper"
                onClick={() => {
                  talk(member.id);
                  const nextRank = rankFor((bond.affection ?? 0) + 6);
                  setPose(RANK_FACE[nextRank] ?? "talk");
                  setSpoken(member.lines[nextRank]);
                }}
              >
                <MessageCircle className="size-4" />
                交谈
              </Button>
              <Button
                variant="paper"
                onClick={() => {
                  const g = GIFTS.find((x) => x.id === member.gift) ?? GIFTS[0]!;
                  gift(member.id, g.id, member.gift);
                  setSpoken(member.lines[rank]);
                  setPose(g.id === member.gift ? "smile" : "talk");
                }}
              >
                <Gift className="size-4" />
                {GIFTS.find((g) => g.id === member.gift)?.label}
              </Button>
              <Button
                variant="paper"
                onClick={() => {
                  invite(member.id);
                  void navigate({
                    to: "/studio",
                    search: { id: member.id, bg: bgId },
                  });
                }}
              >
                <Sparkles className="size-4" />
                邀约
              </Button>
            </div>
          )}
          <div className="grid grid-cols-5 gap-1">
            {GIFTS.map((g) => (
              <button
                key={g.id}
                type="button"
                disabled={!bond}
                onClick={() => {
                  gift(member.id, g.id, member.gift);
                  setSpoken(g.id === member.gift ? member.lines.crush : member.lines.friend);
                  setPose(g.id === member.gift ? "smile" : "talk");
                }}
                className={cn(
                  "h-9 rounded-[10px] text-[11px] bg-paper-2 text-ink-soft disabled:opacity-40",
                  member.gift === g.id && "ring-1 ring-rose text-rose",
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatBar label="魅力" value={member.stats.charm} />
          <StatBar label="知性" value={member.stats.intellect} />
          <StatBar label="温度" value={member.stats.warmth} />
          <StatBar label="意志" value={member.stats.will} />
          <StatBar label="衣品" value={member.stats.style} />
        </div>

        <div className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)] space-y-3">
          <p className="text-sm text-muted">对白</p>
          {(Object.keys(RANK_LABEL) as Array<keyof typeof RANK_LABEL>).map((rk) => (
            <button
              key={rk}
              type="button"
              onClick={() => setSpoken(member.lines[rk])}
              className="block w-full rounded-[16px] bg-paper px-3 py-2.5 text-left"
            >
              <span className="text-[11px] text-rose">{RANK_LABEL[rk]}</span>
              <p className="text-sm text-ink-soft">{member.lines[rk]}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              void downloadAsset(
                poseSrc(look.id, pose),
                `${member.name}-cutout.png`,
              )
            }
          >
            <Download className="size-4" />
            下载透明立绘
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              void exportScenePng({
                characterSrc: poseSrc(look.id, pose),
                backgroundSrc: BACKGROUNDS.find((b) => b.id === bgId)?.src,
                name: member.name,
                line,
                filename: `${member.name}-${bgId}.png`,
              })
            }
          >
            <Download className="size-4" />
            导出场景
          </Button>
        </div>
      </div>
    </main>
  );
}
