/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // <<< MUDANÇA: Adicionamos nossa paleta de cores personalizada
      colors: {
        'background': '#F8F7F4', // Um off-white quente
        'surface': '#FFFFFF',    // A superfície dos cards
        'primary': '#4A55A2',    // Um azul/roxo sólido e elegante
        'primary-light': '#C5DFF8', // Um azul pastel para seleção
        'text-main': '#333333',     // Texto principal
        'text-subtle': '#666666',   // Texto secundário
        'border-color': '#EAEAEA', // Cor da borda sutil
      }
    },
  },
  plugins: [],
}