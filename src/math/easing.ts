export type EasingFunction = (t: number) => number;

export const clamp01 = (t: number): number => 
  Math.max(0, Math.min(1, t));

export const linear: EasingFunction = (t: number): number => 
  clamp01(t);

export const quinticEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  const u2 = u * u;
  return u2 * u * (10 - 15 * u + 6 * u2);
};

export const quinticEaseInOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  const u2 = u * u;
  const u3 = u2 * u;
  return u3 * (6 * u2 - 15 * u + 10);
};

export const quadraticEaseIn: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return u * u;
};

export const quadraticEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return u * (2 - u);
};

export const quadraticEaseInOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return u < 0.5 ? 2 * u * u : -1 + (4 - 2 * u) * u;
};

export const cubicEaseIn: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return u * u * u;
};

export const cubicEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  const u1 = u - 1;
  return u1 * u1 * u1 + 1;
};

export const cubicEaseInOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return u < 0.5 ? 4 * u * u * u : (u - 1) * (2 * u - 2) * (2 * u - 2) + 1;
};

export const elasticEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  if (u === 0 || u === 1) return u;
  const p = 0.3;
  return Math.pow(2, -10 * u) * Math.sin((u - p / 4) * (2 * Math.PI) / p) + 1;
};

export const bounceEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  if (u < 1 / 2.75) {
    return 7.5625 * u * u;
  } else if (u < 2 / 2.75) {
    const u1 = u - 1.5 / 2.75;
    return 7.5625 * u1 * u1 + 0.75;
  } else if (u < 2.5 / 2.75) {
    const u1 = u - 2.25 / 2.75;
    return 7.5625 * u1 * u1 + 0.9375;
  } else {
    const u1 = u - 2.625 / 2.75;
    return 7.5625 * u1 * u1 + 0.984375;
  }
};

export const sineEaseIn: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return 1 - Math.cos((u * Math.PI) / 2);
};

export const sineEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return Math.sin((u * Math.PI) / 2);
};

export const sineEaseInOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  return -(Math.cos(Math.PI * u) - 1) / 2;
};

export const backEaseOut: EasingFunction = (t: number): number => {
  const u = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
};