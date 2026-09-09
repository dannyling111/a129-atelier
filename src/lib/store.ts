import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CAST, type GiftId } from "@/lib/cast";

export type Bond = {
  affection: number;
  metAt: number;
  talks: number;
  gifts: number;
};

type AtelierState = {
  bonds: Record<string, Bond>;
  favorites: string[];
  lastGift: Record<string, GiftId | undefined>;
  toast: string | null;
  meet: (id: string) => void;
  encounter: () => string | null;
  talk: (id: string) => number;
  gift: (id: string, giftId: GiftId, preferred: GiftId) => number;
  invite: (id: string) => number;
  toggleFavorite: (id: string) => void;
  clearToast: () => void;
};

const STARTER = CAST;

function ensureBond(bonds: Record<string, Bond>, id: string): Record<string, Bond> {
  if (bonds[id]) return bonds;
  return {
    ...bonds,
    [id]: { affection: 8, metAt: Date.now(), talks: 0, gifts: 0 },
  };
}

export const useAtelier = create<AtelierState>()(
  persist(
    (set, get) => ({
      bonds: Object.fromEntries(
        STARTER.map((c) => [
          c.id,
          { affection: 12 + (c.index % 17), metAt: Date.now(), talks: 0, gifts: 0 },
        ]),
      ),
      favorites: STARTER.filter((c) => c.rarity === "SSR").slice(0, 3).map((c) => c.id),
      lastGift: {},
      toast: null,
      meet: (id) =>
        set((s) => ({
          bonds: ensureBond(s.bonds, id),
        })),
      encounter: () => {
        const { bonds } = get();
        const unmet = CAST.filter((c) => !bonds[c.id]);
        if (unmet.length === 0) {
          set({ toast: "四位都已遇见。" });
          return null;
        }
        const pick = unmet[Math.floor(Math.random() * unmet.length)]!;
        set((s) => ({
          bonds: {
            ...s.bonds,
            [pick.id]: { affection: 6, metAt: Date.now(), talks: 0, gifts: 0 },
          },
          toast: `遇见了 ${pick.name}`,
        }));
        return pick.id;
      },
      talk: (id) => {
        let next = 0;
        set((s) => {
          const bonds = ensureBond(s.bonds, id);
          const cur = bonds[id]!;
          const gain = 5 + Math.floor(Math.random() * 5);
          next = Math.min(100, cur.affection + gain);
          return {
            bonds: {
              ...bonds,
              [id]: { ...cur, affection: next, talks: cur.talks + 1 },
            },
            toast: `好感 +${next - cur.affection}`,
          };
        });
        return next;
      },
      gift: (id, giftId, preferred) => {
        let next = 0;
        set((s) => {
          const bonds = ensureBond(s.bonds, id);
          const cur = bonds[id]!;
          const gain = giftId === preferred ? 14 : 6;
          next = Math.min(100, cur.affection + gain);
          return {
            bonds: {
              ...bonds,
              [id]: { ...cur, affection: next, gifts: cur.gifts + 1 },
            },
            lastGift: { ...s.lastGift, [id]: giftId },
            toast: giftId === preferred ? `正合心意  +${gain}` : `收下了  +${gain}`,
          };
        });
        return next;
      },
      invite: (id) => {
        let next = 0;
        set((s) => {
          const bonds = ensureBond(s.bonds, id);
          const cur = bonds[id]!;
          const gain = 8;
          next = Math.min(100, cur.affection + gain);
          return {
            bonds: {
              ...bonds,
              [id]: { ...cur, affection: next },
            },
            toast: `赴约  +${gain}`,
          };
        });
        return next;
      },
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),
      clearToast: () => set({ toast: null }),
    }),
    { name: "atelier-v4", skipHydration: true },
  ),
);

export function isMet(bonds: Record<string, Bond>, id: string) {
  return Boolean(bonds[id]);
}
