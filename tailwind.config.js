/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // <<< MUDANÇA 1: Importar o tema padrão

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // <<< MUDANÇA 2: Adicionar a configuração da nova família de fontes
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'background': '#F8F7F4',
        'surface': '#FFFFFF',
        'primary': '#4A55A2',
        'primary-light': '#C5DFF8',
        'text-main': '#333333',
        'text-subtle': '#666666',
        'border-color': '#EAEAEA',
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(120deg, #7895CB 0%, #A0BFE0 50%, #C5DFF8 100%)',
      }
    },
  },
  plugins: [],
}