import { defineConfig, presetUno, presetAttributify, presetTypography, presetWebFonts } from 'unocss'
import { presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700'
      }
    })
  ],
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      },
      secondary: {
        50: '#fff7ed',
        100: '#ffedd5',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c'
      }
    }
  },
  shortcuts: {
    'btn': 'px-6 py-2 rounded-full transition-colors duration-200',
    'btn-primary': 'bg-primary-500 text-white hover:bg-primary-600',
    'card': 'bg-yellow-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
    'input': 'w-full px-4 py-2 rounded border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition duration-200'
  }
})