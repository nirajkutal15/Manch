import { useEffect } from 'react'
export function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*80) })
    },{threshold:0.1})
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))
    return ()=>obs.disconnect()
  },[])
}
