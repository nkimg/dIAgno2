/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#F8F7F4',
        'surface': '#FFFFFF',
        'primary': '#4A55A2',
        'primary-light': '#C5DFF8',
        'text-main': '#333333',
        'text-subtle': '#666666',
        'border-color': '#EAEAEA',
      },
      // <<< MUDANÇA: Adicionamos a definição do nosso gradiente
      backgroundImage: {
        'header-gradient': 'linear-gradient(120deg, #7895CB 0%, #A0BFE0 50%, #C5DFF8 100%)',
      }
    },
  },
  plugins: [],
}