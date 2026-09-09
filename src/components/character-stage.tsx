import { cn } from "@/lib/cn";
import type { CastMember } from "@/lib/cast";
import { lookOf } from "@/lib/cast";
import { BACKGROUNDS } from "@/lib/backgrounds";
import { BUST_POSES, FULL_POSES, shotOf, type PoseId } from "@/lib/poses";
import { poseSrc } from "@/lib/looks";

export function CharacterStage({
  member,
  bgId,
  line,
  pose = "idle",
  className,
  checker,
}: {
  member: CastMember;
  bgId?: string | null;
  line?: string | null;
  pose?: PoseId;
  className?: string;
  checker?: boolean;
}) {
  const look = lookOf(member);
  const bg = BACKGROUNDS.find((b) => b.id === bgId);
  const src = poseSrc(look.id, pose);
  const bust = shotOf(pose) === "bust";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-2",
        checker && !bg ? "checker" : "",
        className,
      )}
    >
      {bg ? (
        <img
          src={bg.src}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 flex justify-center",
          bust ? "inset-y-0 items-end" : "bottom-0 top-[6%] items-end",
        )}
      >
        <img
          src={src}
          alt={member.name}
          className={cn(
            "w-auto max-w-full object-contain drop-shadow-[0_18px_28px_rgba(28,25,23,0.18)]",
            bust ? "h-[108%] object-bottom" : "h-full object-bottom",
          )}
          draggable={false}
        />
      </div>
      {line ? (
        <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-5">
          <DialoguePlate name={member.name} line={line} />
        </div>
      ) : null}
    </div>
  );
}

export function PoseStrip({
  value,
  onChange,
}: {
  lookId?: string;
  value: PoseId;
  onChange: (pose: PoseId) => void;
}) {
  return (
    <div className="space-y-3">
      <Group title="全身 · 站姿" poses={FULL_POSES} value={value} onChange={onChange} />
      <Group title="半身 · 表情" poses={BUST_POSES} value={value} onChange={onChange} />
    </div>
  );
}

function Group({
  title,
  poses,
  value,
  onChange,
}: {
  title: string;
  poses: { id: PoseId; label: string; hint: string }[];
  value: PoseId;
  onChange: (pose: PoseId) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {poses.map((p) => {
          const active = value === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              title={p.hint}
              className={cn(
                "h-10 min-w-14 rounded-full px-3.5 text-sm transition-colors duration-150",
                active
                  ? "bg-ink text-paper"
                  : "bg-paper-2 text-ink-soft hover:bg-paper-3",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DialoguePlate({ name, line }: { name: string; line: string }) {
  return (
    <div className="rounded-[20px] bg-surface/92 px-4 py-3 shadow-[var(--shadow-border)] backdrop-blur-sm">
      <div className="mb-1 font-serif text-sm text-rose">{name}</div>
      <p className="text-[15px] leading-relaxed text-ink-soft">{line}</p>
    </div>
  );
}

export function Cutout({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-auto object-contain object-bottom select-none", className)}
      draggable={false}
    />
  );
}
