import { asset } from "@/lib/asset";

export type SceneBg = {
  id: string;
  src: string;
  title: string;
  titleZh: string;
};

export const BACKGROUNDS: SceneBg[] = [
  { id: "studio", src: asset("backgrounds/studio.jpg"), title: "Studio", titleZh: "白墙" },
  { id: "cafe", src: asset("backgrounds/cafe.jpg"), title: "Cafe", titleZh: "窗边" },
  { id: "rooftop", src: asset("backgrounds/rooftop.jpg"), title: "Rooftop", titleZh: "暮色天台" },
  { id: "sakura", src: asset("backgrounds/sakura.jpg"), title: "Sakura", titleZh: "樱径" },
  { id: "night", src: asset("backgrounds/night.jpg"), title: "Night Arcade", titleZh: "夜街" },
  { id: "apartment", src: asset("backgrounds/apartment.jpg"), title: "Apartment", titleZh: "晨光公寓" },
  { id: "bookstore", src: asset("backgrounds/bookstore.jpg"), title: "Bookstore", titleZh: "书店" },
  { id: "seaside", src: asset("backgrounds/seaside.jpg"), title: "Seaside", titleZh: "栈道" },
];

export const BG_BY_ID: Record<string, SceneBg> = Object.fromEntries(
  BACKGROUNDS.map((bg) => [bg.id, bg]),
);
