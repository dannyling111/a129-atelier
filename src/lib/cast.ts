import { LOOK_BY_ID, type Gender, type Look } from "@/lib/looks";
import type { PoseId } from "@/lib/poses";

export type Rarity = "N" | "R" | "SR" | "SSR";
export type GiftId = "flower" | "book" | "coffee" | "sweet" | "jewel";
export type Rank = "stranger" | "friend" | "trust" | "crush" | "bond";

export type CastMember = {
  id: string;
  index: number;
  lookId: string;
  name: string;
  kana: string;
  gender: Gender;
  age: number;
  city: string;
  job: string;
  tags: string[];
  rarity: Rarity;
  gift: GiftId;
  stats: {
    charm: number;
    intellect: number;
    warmth: number;
    will: number;
    style: number;
  };
  bio: string;
  lines: Record<Rank, string>;
  faces: Partial<Record<PoseId, string>>;
  archetype: string;
};

export const GIFTS: { id: GiftId; label: string }[] = [
  { id: "flower", label: "花束" },
  { id: "book", label: "新刊" },
  { id: "coffee", label: "手冲" },
  { id: "sweet", label: "和菓子" },
  { id: "jewel", label: "耳饰" },
];

export const RANK_LABEL: Record<Rank, string> = {
  stranger: "陌生",
  friend: "相识",
  trust: "信赖",
  crush: "心动",
  bond: "羁绊",
};

export function rankFor(affection: number): Rank {
  if (affection >= 80) return "bond";
  if (affection >= 60) return "crush";
  if (affection >= 40) return "trust";
  if (affection >= 20) return "friend";
  return "stranger";
}

export function rankThreshold(rank: Rank): number {
  return { stranger: 0, friend: 20, trust: 40, crush: 60, bond: 80 }[rank];
}

export const CAST: CastMember[] = [
  {
    id: "nanfeng",
    index: 1,
    lookId: "ruffle",
    name: "陆南风",
    kana: "Nanfeng",
    gender: "f",
    age: 24,
    city: "东京",
    job: "独立设计师",
    tags: ["利落", "礼服", "风色裙裾", "夜猫", "记人名"],
    rarity: "SSR",
    gift: "coffee",
    stats: { charm: 86, intellect: 74, warmth: 58, will: 82, style: 91 },
    bio: "东京的独立设计师。蓝橙渐变裙摆比她的嘴更快。说话很直，但会把你随口提过的歌记下来。",
    archetype: "利落",
    lines: {
      stranger: "有话直说。我不太擅长寒暄。",
      friend: "还行。比上次准时。",
      trust: "出了问题先来找我。",
      crush: "看什么看。过来。",
      bond: "从今天起，你的事就是我的事。",
    },
    faces: {
      idle: "先说正事。",
      smile: "……笑什么。裙摆自己在动。",
      shy: "别盯着看。风把头发吹乱了而已。",
      cool: "我时间不多。把样刊给我。",
      sad: "今晚灯就不开那么亮了。",
      talk: "你再这样笑，我可不管了。",
    },
  },
  {
    id: "qinghe",
    index: 2,
    lookId: "sage",
    name: "沈清和",
    kana: "Qinghe",
    gender: "f",
    age: 23,
    city: "京都",
    job: "画廊助理",
    tags: ["温柔", "礼服", "鼠尾草绿", "手写回信", "怕冷"],
    rarity: "SR",
    gift: "flower",
    stats: { charm: 78, intellect: 81, warmth: 88, will: 64, style: 84 },
    bio: "京都的画廊助理。银白长发、鼠尾草吊带，肩带细得几乎看不见。写信比发消息更勤。",
    archetype: "温柔",
    lines: {
      stranger: "你好。今天光线很好。",
      friend: "我给你留了靠窗的位置。",
      trust: "你今天看起来有点累。慢慢说就好。",
      crush: "和你说话的时候，我会忘记时间。",
      bond: "我想把季节都分给你一半。",
    },
    faces: {
      idle: "请坐。不必拘谨。",
      smile: "你来得正好。茶还是热的。",
      shy: "可以……再靠近一点吗。",
      cool: "展览要从最后一件看起。",
      sad: "雨天我会提前十分钟出门。今天没有。",
      talk: "你的声音很好听。我记下了。",
    },
  },
  {
    id: "yuanbai",
    index: 3,
    lookId: "linen",
    name: "周远白",
    kana: "Yuanbai",
    gender: "m",
    age: 26,
    city: "镰仓",
    job: "独立书店主理",
    tags: ["疏离", "日常", "亚麻", "随身带书", "周末不去人多的地方"],
    rarity: "SR",
    gift: "book",
    stats: { charm: 72, intellect: 86, warmth: 70, will: 68, style: 77 },
    bio: "镰仓的独立书店主理。袖口永远卷到小臂，像刚从码头回来。说话很慢，句子总在中间停一下。",
    archetype: "疏离",
    lines: {
      stranger: "啊，你是……算了，请坐。",
      friend: "这本可以借你。不必客气。",
      trust: "你要是累了，就在这儿坐一会儿。",
      crush: "你这样看着我，我会不知道把手放哪。",
      bond: "以后的路，我想跟你一起走。",
    },
    faces: {
      idle: "风倒是不错。",
      smile: "你来得正好，我正要走。——也可以不走。",
      shy: "别笑。我没在开玩笑。",
      cool: "先说正事。新刊在左手边。",
      sad: "今晚……可以再待一会儿。",
      talk: "不必承诺什么。你在就够了。",
    },
  },
  {
    id: "xiulang",
    index: 4,
    lookId: "knit",
    name: "顾修朗",
    kana: "Xiulang",
    gender: "m",
    age: 27,
    city: "金泽",
    job: "杂志编辑",
    tags: ["冷静", "礼服", "黑高领", "只喝热的", "不坐窗边"],
    rarity: "SSR",
    gift: "jewel",
    stats: { charm: 80, intellect: 90, warmth: 52, will: 88, style: 85 },
    bio: "金泽的杂志编辑。高领与阔腿裤，把声音放得很低。只在第一杯咖啡之后开始说话。",
    archetype: "冷静",
    lines: {
      stranger: "……你找我有事？",
      friend: "今天风倒是不错。",
      trust: "这事你不用一个人扛。我听着。",
      crush: "今晚可以再待一会儿。别问为什么。",
      bond: "你在，我就安心。",
    },
    faces: {
      idle: "我时间不多。",
      smile: "……很少这样。别拍照。",
      shy: "靠近一些。再近一些。",
      cool: "样刊不要洒到咖啡。",
      sad: "我很少把心放在明处。",
      talk: "此后，请多指教。用一生那种。",
    },
  },
];

export const CAST_BY_ID: Record<string, CastMember> = Object.fromEntries(
  CAST.map((c) => [c.id, c]),
);
export const READY_CAST = CAST;

export function lookOf(member: CastMember): Look {
  return LOOK_BY_ID[member.lookId]!;
}

export function lineFor(member: CastMember, pose: PoseId, rank: Rank): string {
  return member.faces[pose] ?? member.lines[rank];
}

export const RARITY_TONE: Record<Rarity, string> = {
  N: "普通",
  R: "精选",
  SR: "稀有",
  SSR: "特典",
};
