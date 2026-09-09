import { type PoseId, POSES } from "@/lib/poses";
import { asset } from "@/lib/asset";

export type Gender = "f" | "m";
export type Season = "ss" | "aw" | "resort" | "night";
export type StyleTag = "office" | "street" | "elegant" | "casual" | "tradition" | "sport";
export type { PoseId };
export { POSES };

export type Look = {
  id: string;
  src: string;
  gender: Gender;
  season: Season;
  style: StyleTag;
  title: string;
  titleZh: string;
  note: string;
};

const CACHE = "v=11";

export function poseSrc(lookId: string, pose: PoseId = "idle"): string {
  return asset(`characters/${lookId}/${pose}.png?${CACHE}`);
}

export const LOOKS: Look[] = [
  {
    id: "ruffle",
    src: poseSrc("ruffle", "idle"),
    gender: "f",
    season: "ss",
    style: "elegant",
    title: "Wind Hem",
    titleZh: "风色裙裾",
    note: "蓝橙渐变与珊瑚荷叶边。",
  },
  {
    id: "sage",
    src: poseSrc("sage", "idle"),
    gender: "f",
    season: "ss",
    style: "elegant",
    title: "Sage Slip",
    titleZh: "鼠尾草绿",
    note: "银白长发与鼠尾草吊带裙。",
  },
  {
    id: "linen",
    src: poseSrc("linen", "idle"),
    gender: "m",
    season: "resort",
    style: "casual",
    title: "Linen",
    titleZh: "亚麻",
    note: "袖口卷到小臂，亚麻衬衫。",
  },
  {
    id: "knit",
    src: poseSrc("knit", "idle"),
    gender: "m",
    season: "aw",
    style: "elegant",
    title: "Black Knit",
    titleZh: "黑高领",
    note: "高领与阔腿裤，把声音放得很低。",
  },
];

export const LOOK_BY_ID: Record<string, Look> = Object.fromEntries(
  LOOKS.map((look) => [look.id, look]),
);

export const READY_LOOKS = LOOKS;
export const READY_IDS = new Set(LOOKS.map((l) => l.id));
export const FEMALE_LOOKS = LOOKS.filter((l) => l.gender === "f");
export const MALE_LOOKS = LOOKS.filter((l) => l.gender === "m");

export function posesOf(_lookId: string): PoseId[] {
  return POSES.map((p) => p.id);
}

export function isLookReady(lookId: string) {
  return READY_IDS.has(lookId);
}
