export type Shot = "full" | "bust";
export type PoseId =
  | "stand"
  | "side"
  | "idle"
  | "smile"
  | "shy"
  | "cool"
  | "sad"
  | "talk";

export const POSES: {
  id: PoseId;
  label: string;
  hint: string;
  shot: Shot;
}[] = [
  { id: "stand", label: "站姿", hint: "自然三分身站立", shot: "full" },
  { id: "side", label: "侧身", hint: "另一侧三分身", shot: "full" },
  { id: "idle", label: "平静", hint: "半身，默认神情", shot: "bust" },
  { id: "smile", label: "微笑", hint: "半身，轻轻笑", shot: "bust" },
  { id: "shy", label: "害羞", hint: "半身，视线偏开", shot: "bust" },
  { id: "cool", label: "认真", hint: "半身，收住表情", shot: "bust" },
  { id: "sad", label: "落寞", hint: "半身，眼睫低一点", shot: "bust" },
  { id: "talk", label: "说话", hint: "半身，开口对白", shot: "bust" },
];

export const FULL_POSES = POSES.filter((p) => p.shot === "full");
export const BUST_POSES = POSES.filter((p) => p.shot === "bust");
export const POSE_IDS: PoseId[] = POSES.map((p) => p.id);

export function shotOf(pose: PoseId): Shot {
  return POSES.find((p) => p.id === pose)?.shot ?? "bust";
}

/** Rank → default bust face, used when talking / gifting. */
export const RANK_FACE: Record<string, PoseId> = {
  stranger: "cool",
  friend: "smile",
  trust: "talk",
  crush: "shy",
  bond: "smile",
};
