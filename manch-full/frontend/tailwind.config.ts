import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink:'#0D0D0D', cream:'#F5F0E8', gold:{'DEFAULT':'#C9A84C','light':'#E8C96A'}, rust:'#C4542A', sage:'#4A6741', muted:'#7A7068', card:'#FDFAF4' }, fontFamily: { display:['Playfair Display','serif'], body:['DM Sans','sans-serif'] } } },
  plugins: []
}
export default config
