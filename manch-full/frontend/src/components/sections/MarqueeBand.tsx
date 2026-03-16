const items = ['Poetry Slams','Stand-up Comedy','Storytelling','Mimicry','Spoken Word','Open Mics','College Fests','Corporate Shows','Cafe Nights','Community Events']
export default function MarqueeBand() {
  const doubled = [...items,...items]
  return (
    <div className="bg-ink py-3.5 overflow-hidden border-t-[3px] border-b-[3px] border-gold">
      <div className="inline-block animate-marquee whitespace-nowrap">
        {doubled.map((item,i) => (
          <span key={i}>
            <span className="font-display italic text-cream/85 px-8 text-base">{item}</span>
            <span className="text-gold text-xl px-1">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
