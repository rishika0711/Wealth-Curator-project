/**
 * Design tokens — spacing, typography, radii, shadows, semantic colors (light/dark).
 */

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  panel: {
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const font = {
  sans: 'Inter, DM Sans, system-ui, sans-serif',
  serif: 'Inter, DM Sans, system-ui, sans-serif',
};

export const themes = {
  dark: {
    bg: '#0a0e14',
    bgElevated: '#161b22',
    bgMuted: '#0d1117',
    sidebarBg: '#0d1117',
    navActiveBg: 'rgba(0, 102, 255, 0.12)',
    border: 'rgba(255,255,255,0.08)',
    text: '#f0f3f8',
    textSecondary: 'rgba(240,243,248,0.72)',
    textMuted: 'rgba(240,243,248,0.45)',
    accent: '#0066ff',
    accentMuted: 'rgba(0, 102, 255, 0.28)',
    onAccent: '#ffffff',
    positive: '#34d399',
    negative: '#f87171',
    warning: '#fbbf24',
    overlay: 'rgba(0,0,0,0.55)',
  },
  light: {
    bg: '#f4f6fb',
    bgElevated: '#ffffff',
    bgMuted: '#e8ecf4',
    sidebarBg: '#ffffff',
    navActiveBg: 'rgba(0, 102, 255, 0.1)',
    border: 'rgba(15,18,20,0.1)',
    text: '#0f172a',
    textSecondary: 'rgba(15,23,42,0.68)',
    textMuted: 'rgba(15,23,42,0.48)',
    accent: '#0058e0',
    accentMuted: 'rgba(0, 88, 224, 0.2)',
    onAccent: '#ffffff',
    positive: '#059669',
    negative: '#dc2626',
    warning: '#d97706',
    overlay: 'rgba(15,23,42,0.35)',
  },
};
