export const COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  accent: "#EE6C4D",
} as const;

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  button: 6,
  card: 8,
} as const;

export const TYPOGRAPHY = {
  fontFamily: "Inter, SF Pro Display, system-ui, sans-serif",
  weights: { regular: 400, medium: 500, semibold: 600 },
  sizes: { h1: 32, h2: 24, h3: 20, bodyLarge: 18, body: 16, caption: 14 },
} as const;