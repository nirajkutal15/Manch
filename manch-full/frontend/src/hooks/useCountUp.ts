import { useRef, useState, useEffect } from 'react'
export function useCountUp(target: number, duration=1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting && !started.current) {
        started.current=true
        const start=performance.now()
        const step=(now:number)=>{ const p=Math.min((now-start)/duration,1); setCount(Math.round(p*target)); if(p<1) requestAnimationFrame(step) }
        requestAnimationFrame(step)
      }
    },{threshold:0.5})
    obs.observe(el); return ()=>obs.disconnect()
  },[target,duration])
  return {ref, count}
}
