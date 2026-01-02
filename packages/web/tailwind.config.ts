import type { Config } from 'tailwindcss'
import {
  gray,
  blue,
  red,
  green,
  amber,
  slate,
  grayDark,
  blueDark,
  redDark,
  greenDark,
  amberDark,
  slateDark,
} from '@radix-ui/colors'

const radixToTailwind = (radixScale: Record<string, string>) => {
  const scale: Record<string, string> = {}
  Object.entries(radixScale).forEach(([key, value]) => {
    const number = key.match(/\d+/)?.[0]
    if (number) {
      scale[number] = value
    }
  })
  return scale
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: radixToTailwind(gray),
        slate: radixToTailwind(slate),
        blue: radixToTailwind(blue),
        red: radixToTailwind(red),
        green: radixToTailwind(green),
        amber: radixToTailwind(amber),
        grayDark: radixToTailwind(grayDark),
        slateDark: radixToTailwind(slateDark),
        blueDark: radixToTailwind(blueDark),
        redDark: radixToTailwind(redDark),
        greenDark: radixToTailwind(greenDark),
        amberDark: radixToTailwind(amberDark),
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
export default config