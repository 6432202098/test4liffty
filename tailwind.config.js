/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./app/**/*.{ts,tsx}",       // App Router
    "./components/**/*.{ts,tsx}", // Components
    "./pages/**/*.{ts,tsx}"      // ถ้ามี Pages Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};