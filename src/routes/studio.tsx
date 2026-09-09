import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { CAST, CAST_BY_ID, RANK_LABEL, lookOf, lineFor, rankFor } from "@/lib/cast";
import { BACKGROUNDS } from "@/lib/backgrounds";
import { Button } from "@/components/ui/button";
import { CharacterStage, PoseStrip } from "@/components/character-stage";
import { cn } from "@/lib/cn";
import { useAtelier } from "@/lib/store";
import { exportScenePng } from "@/lib/export-scene";
import { poseSrc } from "@/lib/looks";
import type { PoseId } from "@/lib/poses";

type Search = { id?: string; bg?: string };

export const Route = createFileRoute("/studio")({
  component: Studio,
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
    bg: typeof s.bg === "string" ? s.bg : undefined,
  }),
});

function Studio() {
  const search = Route.useSearch();
  const bonds = useAtelier((s) => s.bonds);
  const invite = useAtelier((s) => s.invite);
  const met = useMemo(() => CAST.filter((c) => bonds[c.id]), [bonds]);
  const fallback = met[0] ?? CAST[0]!;
  const [id, setId] = useState(search.id && CAST_BY_ID[search.id] ? search.id : fallback.id);
  const [bgId, setBgId] = useState(search.bg ?? "cafe");
  const [custom, setCustom] = useState("");
  const [showLine, setShowLine] = useState(true);
  const [checker, setChecker] = useState(false);
  const [pose, setPose] = useState<PoseId>("idle");

  const member = CAST_BY_ID[id] ?? fallback;
  const look = lookOf(member);
  const affection = bonds[member.id]?.affection ?? 0;
  const rank = rankFor(affection);
  const line = custom.trim() || lineFor(member, pose, rank);

  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] tracking-[0.24em] text-muted">SCENE STUDIO</p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight">场景工坊</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            把立绘叠在场景上。全身两套自然站姿，半身六种表情推对白。四个人同一套模板。
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted">角色</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(met.length ? met : CAST.slice(0, 12)).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setId(c.id);
                  setPose("idle");
                }}
                aria-label={c.name}
                className={cn(
                  "relative h-24 w-16 shrink-0 overflow-hidden rounded-[14px] bg-paper-2",
                  id === c.id ? "ring-2 ring-ink" : "",
                )}
              >
                <img
                  src={lookOf(c).src}
                  alt=""
                  className="absolute inset-x-0 bottom-0 h-[130%] w-full object-contain object-bottom"
                />
              </button>
            ))}
          </div>
          {met.length === 0 ? (
            <p className="text-xs text-muted">
              还没有遇见任何人。可先从
              <Link to="/" className="text-rose">
                图鉴
              </Link>
              开始。
            </p>
          ) : null}
        </div>

        <PoseStrip value={pose} onChange={setPose} />

        <div className="space-y-2">
          <p className="text-xs text-muted">场景</p>
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setChecker(false);
                  setBgId(bg.id);
                }}
                className={cn(
                  "overflow-hidden rounded-[14px]",
                  !checker && bgId === bg.id ? "ring-2 ring-ink" : "opacity-85",
                )}
              >
                <img src={bg.src} alt="" className="aspect-[2/3] w-full object-cover" />
                <span className="block bg-surface px-1 py-1 text-center text-[10px] text-muted">
                  {bg.titleZh}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setChecker(true)}
            className={cn(
              "h-9 rounded-full px-3 text-xs",
              checker ? "bg-ink text-paper" : "bg-paper-2 text-ink-soft",
            )}
          >
            透明棋盘
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted">对白 · {RANK_LABEL[rank]}</p>
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={member.lines[rank]}
            rows={3}
            className="w-full resize-none rounded-[16px] bg-surface p-3 text-sm text-ink shadow-[var(--shadow-border)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowLine((v) => !v)}
              className="h-9 rounded-full bg-paper-2 px-3 text-xs"
            >
              {showLine ? "隐藏对白" : "显示对白"}
            </button>
            {(Object.keys(RANK_LABEL) as Array<keyof typeof RANK_LABEL>).map((rk) => (
              <button
                key={rk}
                type="button"
                onClick={() => setCustom(member.lines[rk])}
                className="h-9 rounded-full bg-paper-2 px-3 text-xs text-ink-soft"
              >
                {RANK_LABEL[rk]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              if (bonds[member.id]) invite(member.id);
              void exportScenePng({
                characterSrc: poseSrc(look.id, pose),
                backgroundSrc: checker ? null : BACKGROUNDS.find((b) => b.id === bgId)?.src,
                name: member.name,
                line: showLine ? line : null,
                filename: `atelier-${member.name}.png`,
              });
            }}
          >
            <Download className="size-4" />
            导出 PNG
          </Button>
          <Link
            to="/cast/$id"
            params={{ id: member.id }}
            className="inline-flex h-11 items-center rounded-[var(--radius-md)] px-4 text-sm font-medium shadow-[var(--shadow-border)] hover:bg-paper-2"
          >
            角色档案
          </Link>
        </div>
      </div>

      <CharacterStage
        member={member}
        bgId={checker ? null : bgId}
        checker={checker}
        pose={pose}
        line={showLine ? line : null}
        className="min-h-[560px] rounded-[28px] lg:min-h-[760px]"
      />
    </main>
  );
}
