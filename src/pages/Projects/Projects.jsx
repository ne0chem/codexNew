import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProjectsHero from "./ProjectsHero";
import "./Projects.css";

// Демонстрационные карточки: замените на реальные объекты и изображения.
const projects = [
  { title: "Специальные технические условия", tag: "СТУ", text: "Индивидуальные требования пожарной безопасности для вашего объекта." },
  { title: "Мероприятия по обеспечению пожарной безопасности", tag: "МОПБ", text: "Проектные решения, объединённые в понятную систему защиты." },
  { title: "Расчёт пожарного риска", tag: "РАСЧЁТ РИСКА", text: "Моделирование сценариев пожара и оценка безопасности людей." },
  { title: "Рабочая документация", tag: "РД", text: "Детальная проработка решений для реализации на объекте." },
  { title: "Системы противопожарной защиты", tag: "ИНЖЕНЕРНЫЕ СИСТЕМЫ", text: "Согласованная работа сигнализации, оповещения и других систем защиты." },
  { title: "Сопровождение проектных решений", tag: "СОПРОВОЖДЕНИЕ", text: "Работа с замечаниями и уточнение документации на этапах проекта." },
].map((project) => ({
  ...project,
  name: "Название проекта",
  work: project.title,
  city: "Город не указан",
  scope: "Проектирование, расчёты, сопровождение экспертизы",
  // Временная визуализация для согласования стилистики, заменить на реальные проекты.
  image: "/assets/projects-preview-dusk.png",
}));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function Projects() {
  const track = useRef(null), scene = useRef(null), cards = useRef([]), line = useRef(null), info = useRef(null);
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
      const target = progress * (projects.length - 1);
      const state = motion.current;
      state.current = reduced.matches ? target : state.current + (target - state.current) * (1 - Math.exp(-dt * 3.8));
      const smoothProgress = state.current / (projects.length - 1);
      document.body.classList.toggle("projects-carousel-dark", rect.top <= 90 && rect.bottom > 90);
      track.current.style.setProperty("--journey", smoothProgress);
      track.current.style.setProperty("--backdrop-shift", `${reduced.matches ? 0 : -smoothProgress * 48}px`);
      track.current.style.setProperty("--grid-offset", `${-smoothProgress * 160}px`);
      const next = clamp(Math.round(state.current), 0, projects.length - 1);
      // Текст исчезает перед сменой проекта и раскрывается вместе с новой карточкой.
      const proximity = 1 - Math.min(1, Math.abs(state.current - next) / 0.5);
      const reveal = reduced.matches ? 1 : clamp(proximity / 0.75, 0, 1);
      const easedReveal = reveal * reveal * (3 - 2 * reveal);
      info.current.style.opacity = easedReveal * clamp((entrance - 0.3) / 0.7, 0, 1);
      info.current.style.transform = `translate3d(0, ${(1 - easedReveal) * 12 + (1 - entrance) * 25}px, 0)`;
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
        card.style.width = `${2.05 * scale * unit}px`;
        card.style.height = `${1.28 * scale * unit}px`;
        card.style.transform = `translate(-50%, -50%) rotateX(0.06rad) translate3d(${p.x * unit}px, ${-p.y * unit}px, ${p.z * unit}px) rotateY(${-d * 1.15 * 0.62}rad) rotateX(${-0.04 + d * 0.02}rad) rotateZ(${d * 0.035}rad)`;
        card.style.visibility = Math.abs(offset) < 3.3 ? "visible" : "hidden";
        card.style.opacity = entrance;
        card.tabIndex = i === focus ? 0 : -1;
      });
      // Проекция той же 3D-спирали: линия проходит через центры карточек.
      const points = [];
      for (let d = -4.5; d <= 4.5; d += 0.035) {
        const p = position(d);
        const y = -p.y * Math.cos(0.06) - p.z * Math.sin(0.06);
        const z = -p.y * Math.sin(0.06) + p.z * Math.cos(0.06);
        const magnification = perspective / (perspective - z * unit);
        points.push(`${points.length ? "L" : "M"}${(width / 2 + p.x * unit * magnification).toFixed(2)},${(height / 2 + y * unit * magnification).toFixed(2)}`);
      }
      line.current.setAttribute("d", points.join(" "));
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); document.body.classList.remove("projects-carousel-dark"); };
  }, []);
  const goTo = (index) => {
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const travel = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + clamp(index, 0, projects.length - 1) / (projects.length - 1) * travel, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <div className="projects">
      <ProjectsHero />
      <section className="projects__track" ref={track} id="project-track" aria-label="Направления работы">
        <div className="projects__viewport">
          <div className="projects__architecture-backdrop" aria-hidden="true">
            <img src="/assets/projects-hero-building.png" alt="" draggable="false" loading="lazy" />
          </div>
          <svg className="projects__orbit" aria-hidden="true">
            <defs><linearGradient id="projects-logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#aa8057" />
              <stop offset="34%" stopColor="#efd2a8" />
              <stop offset="62%" stopColor="#b58b61" />
              <stop offset="100%" stopColor="#e5c39a" />
            </linearGradient></defs>
            <path ref={line} />
          </svg>
          <div className="projects__scene" ref={scene}>
            {projects.map((project, i) => <button className="projects__card" key={project.tag} ref={(node) => { cards.current[i] = node; }} onClick={() => goTo(i)} aria-label={project.name}><img src={project.image} alt="" draggable="false" /></button>)}
          </div>
          <div className="projects__tree" aria-hidden="true"><img src="/assets/projects-olive-tree.png" alt="" draggable="false" /></div>
          <aside className="projects__info" aria-label="Информация о проекте" aria-live="polite" aria-atomic="true">
            <div className="projects__info-content" ref={info}>
              <div className="projects__info-accent" aria-hidden="true"><i /><span /></div>
              <h2>{projects[active].name}</h2>
              <p className="projects__info-work">{projects[active].work}</p>
              <div className="projects__info-meta">
                <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>{projects[active].city}</span></p>
                <p><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="m2 7 10-5 10 5-10 5L2 7Zm0 5 10 5 10-5M2 17l10 5 10-5"/></svg><span>{projects[active].scope}</span></p>
              </div>
            </div>
          </aside>
          <div className="projects__controls"><div><button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Предыдущий проект">←</button><button onClick={() => goTo(active + 1)} disabled={active === projects.length - 1} aria-label="Следующий проект">→</button></div></div>
        </div>
      </section>
      <section className="projects__process"><p className="projects__eyebrow">02 / ПОДХОД К РАБОТЕ</p><h2>От исходных данных<br />к продуманному решению.</h2><div className="projects__steps">{[["01", "Изучаем объект", "Собираем исходные данные и определяем задачи."], ["02", "Разрабатываем решения", "Увязываем требования, расчёты и проектную документацию."], ["03", "Прорабатываем детали", "Готовим рабочую документацию и сопровождаем решения."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="projects__contact"><p className="projects__eyebrow">ОБСУДИМ ВАШ ОБЪЕКТ</p><h2>Начнём с вашей задачи.</h2><Link to="/contacts">Связаться с нами <span>↗</span></Link></section>
    </div>
  );
}
