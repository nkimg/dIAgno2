/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'background': '#F8F7F4',
        'surface': '#FFFFFF',
        'primary': '#4A55A2',
        'primary-dark': '#3A4480',
        'primary-light': '#C5DFF8',
        'text-main': '#333333',
        'text-subtle': '#666666',
        'border-color': '#EAEAEA',
      },
      backgroundImage: {
        'header-gradient': 'linear-gradient(120deg, var(--tw-color-primary-dark) 0%, var(--tw-color-primary) 100%)',
        // <<< MUDANÇA 1: Renomeado o gradiente antigo e adicionado o novo
        'anamnesis-gradient': 'linear-gradient(to right, #7AA1D2, #DBD4B4, #CC95C0)',
        'main-page-gradient': 'linear-gradient(to right, #4A569D, #DC2424)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}