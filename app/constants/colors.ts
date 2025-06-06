export const colors = {
  primary: {
    DEFAULT: '#1A365D', // Dark navy blue
    light: '#2A4A7D',
    dark: '#0F2444',
  },
  secondary: {
    DEFAULT: '#E2E8F0', // Light gray with slight blue tint
    light: '#F7FAFC',
    dark: '#CBD5E0',
  },
  accent: {
    DEFAULT: '#4299E1', // Bright blue for accents
    light: '#63B3ED',
    dark: '#3182CE',
  },
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    light: '#A0AEC0',
  },
  background: {
    DEFAULT: '#FFFFFF',
    dark: '#F7FAFC',
  },
  error: '#E53E3E',
  success: '#38A169',
  warning: '#DD6B20',
} as const;

export default colors; 