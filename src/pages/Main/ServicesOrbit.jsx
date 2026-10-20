import { useEffect, useRef, useState } from "react";
import { services } from "../../data/services";
import "./ServicesOrbit.css";
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export default function ServicesOrbit() {
  const track = useRef(null), scene = useRef(null), cards = useRef([]), info = useRef(null), orbitLine = useRef(null);
  const motion = useRef({ current: 0, arrival: 0 });
  const [active, setActive] = useState(0);
  useEffect(() => {
    const element = scene.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame, last = performance.now(), focus = -1;
    const render = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const rect = track.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = clamp(-rect.top / Math.max(1, rect.height - viewportHeight), 0, 1);
      const entry = clamp((viewportHeight * 0.75 - rect.top) / (viewportHeight * 0.75), 0, 1);
      const arrival = motion.current;
      arrival.arrival = reduced.matches ? 1 : arrival.arrival + (entry - arrival.arrival) * (1 - Math.exp(-dt * 7));
      const entrance = arrival.arrival * arrival.arrival * (3 - 2 * arrival.arrival);
      track.current.style.setProperty("--gallery-entry", entrance);
      track.current.style.setProperty("--arrival-shift", `${(1 - entrance) * 55}px`);
      track.current.style.setProperty("--arrival-scale", 0.975 + entrance * 0.025);
      const target = progress * (services.length - 1);
      const state = motion.current;
      state.current = reduced.matches ? target : state.current + (target - state.current) * (1 - Math.exp(-dt * 3.8));
      const smoothProgress = state.current / (services.length - 1);

      track.current.style.setProperty("--journey", smoothProgress);
      track.current.style.setProperty("--backdrop-shift", `${reduced.matches ? 0 : -smoothProgress * 48}px`);
      track.current.style.setProperty("--grid-offset", `${-smoothProgress * 160}px`);
      const next = clamp(Math.round(state.current), 0, services.length - 1);
      if (info.current) {
        info.current.style.opacity = entrance;
        info.current.style.transform = `translateY(${Math.round((1 - entrance) * 18)}px)`;
      }
      if (focus !== next) { focus = next; setActive(next); }
      const { width, height } = element.getBoundingClientRect();
      const aspect = width / height, scale = aspect < 1 ? 0.72 : 1;
      const distance = aspect < 1 ? Math.max(7.2, 4.6 / aspect) : 7.2;
      const perspective = height / (2 * Math.tan(Math.PI / 12));
      const unit = perspective / distance;
      element.style.perspective = `${perspective}px`;
      // Равномерная спираль: положение и поворот используют один и тот же шаг.
      const position = (d) => ({ x: Math.sin(d * 1.15) * 2.7 * scale, y: -d * 0.95 - 0.12, z: Math.cos(d * 1.15) * 2.3 * scale * 0.95 });
      cards.current.forEach((card, i) => {
        const offset = i - state.current;
        const d = offset;
        const p = position(d);
        // Project the orbit into ordinary 2D layout, keeping text out of
        // perspective-scaled compositor textures.
        const y = -p.y * Math.cos(0.06) - p.z * Math.sin(0.06);
        const z = -p.y * Math.sin(0.06) + p.z * Math.cos(0.06);
        const magnification = perspective / (perspective - z * unit);
        const cardWidth = Math.round(1.7 * scale * unit * magnification);
        const cardHeight = Math.round(0.98 * scale * unit * magnification);
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.zIndex = String(Math.round(magnification * 100));
        const settled = Math.abs(d) < 0.08;
        card.style.transform = `translate(${Math.round(p.x * unit * magnification - cardWidth / 2)}px, ${Math.round(y * unit * magnification - cardHeight / 2)}px) rotate(${settled ? 0 : d * 0.035}rad)`;
        card.style.visibility = Math.abs(offset) < 3.3 ? "visible" : "hidden";
        card.style.opacity = entrance;
        card.tabIndex = i === focus ? 0 : -1;
      });
      const orbitPoints = [];
      for (let d = -4.5; d <= 4.5; d += 0.04) {
        const p = position(d);
        const y = -p.y * Math.cos(0.06) - p.z * Math.sin(0.06);
        const z = -p.y * Math.sin(0.06) + p.z * Math.cos(0.06);
        const magnification = perspective / (perspective - z * unit);
        orbitPoints.push(`${orbitPoints.length ? "L" : "M"}${(width/2+p.x*unit*magnification).toFixed(2)},${(height/2+y*unit*magnification).toFixed(2)}`);
      }
      orbitLine.current?.setAttribute("d", orbitPoints.join(" "));
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); };
  }, []);
  const goTo = (index) => {
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const travel = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + clamp(index, 0, services.length - 1) / (services.length - 1) * travel, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const [details, setDetails] = useState(null);
  const closeButton = useRef(null), opener = useRef(null);
  useEffect(() => {
    if (!details) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setDetails(null);
      if (event.key === "Tab") { event.preventDefault(); closeButton.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); opener.current?.focus(); };
  }, [details]);
  return <section className="services-orbit" id="services" aria-label="Наши услуги" ref={track}>
    <div className="services-orbit__viewport">
      <img className="services-orbit__robot-image" src="/assets/services-robot.png" alt="" aria-hidden="true" draggable="false" loading="lazy" />

      <div className="services-orbit__heading"><h2 className="eyebrow">02 / НАШИ УСЛУГИ</h2></div>
      <svg className="services-orbit__guide" aria-hidden="true"><path ref={orbitLine}/></svg>
      <div className="services-orbit__scene" ref={scene}>
        {services.map((service, i) => <button className={`service-card service-card--image${i === active ? " service-card--active" : ""}`} key={service.id} ref={node => {cards.current[i] = node;}} onClick={() => goTo(i)} aria-label={`Выбрать: ${service.title}`}>
          <img className="service-card__cover" src={`/assets/services/clean/${service.category}.png`} alt={service.title} draggable="false" loading="lazy"/>
        </button>)}
      </div>
      <aside className="services-orbit__info" aria-live="polite" aria-atomic="true"><div ref={info}>
        <h3>{services[active].title}</h3>
        <p>{services[active].description}</p>
        <div className="services-orbit__price"><strong>{services[active].price}</strong><button onClick={event=>{opener.current=event.currentTarget;setDetails(services[active]);}}><span className="service-details-label">Подробнее</span></button></div>
      </div></aside>
      <div className="services-orbit__controls"><span>{String(active+1).padStart(2,"0")} <i>/ {String(services.length).padStart(2,"0")}</i></span><div className="services-orbit__progress"><i style={{width:`${(active+1)/services.length*100}%`}}/></div><button aria-label="Предыдущая услуга" disabled={active===0} onClick={()=>goTo(active-1)}>←</button><button aria-label="Следующая услуга" disabled={active===services.length-1} onClick={()=>goTo(active+1)}>→</button></div>
    </div>
    {details && <div className="service-dialog-backdrop" onClick={event=>{if(event.target===event.currentTarget)setDetails(null);}}><section className="service-dialog" role="dialog" aria-modal="true" aria-labelledby="service-dialog-title"><button ref={closeButton} className="service-dialog__close" onClick={()=>setDetails(null)} aria-label="Закрыть">✕</button><span className="eyebrow">CODEXTECH / УСЛУГИ</span><h2 id="service-dialog-title">{details.title}</h2><strong>{details.price}</strong><p>{details.description}</p><ul>{details.info.map(item=><li key={item}>{item}</li>)}</ul></section></div>}
  </section>;
}
