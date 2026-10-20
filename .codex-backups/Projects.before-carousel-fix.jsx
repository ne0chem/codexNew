import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";

// Демонстрационные карточки: замените на реальные объекты и изображения.
const projects = [
  { title: "Специальные технические условия", tag: "СТУ", text: "Индивидуальные требования пожарной безопасности для вашего объекта." },
  { title: "Мероприятия по обеспечению пожарной безопасности", tag: "МОПБ", text: "Проектные решения, объединённые в понятную систему защиты." },
  { title: "Расчёт пожарного риска", tag: "РАСЧЁТ РИСКА", text: "Моделирование сценариев пожара и оценка безопасности людей." },
  { title: "Рабочая документация", tag: "РД", text: "Детальная проработка решений для реализации на объекте." },
  { title: "Системы противопожарной защиты", tag: "ИНЖЕНЕРНЫЕ СИСТЕМЫ", text: "Согласованная работа сигнализации, оповещения и других систем защиты." },
  { title: "Сопровождение проектных решений", tag: "СОПРОВОЖДЕНИЕ", text: "Работа с замечаниями и уточнение документации на этапах проекта." },
].map((project) => ({ ...project, image: "/assets/image_2026-08-17_13-08-24.png" }));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function Projects() {
  const track = useRef(null), scene = useRef(null), cards = useRef([]), line = useRef(null);
  const motion = useRef({ current: 0 });
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
      const target = progress * (projects.length - 1);
      const state = motion.current;
      state.current = reduced.matches ? target : state.current + (target - state.current) * (1 - Math.exp(-dt * 3.8));
      const smoothProgress = state.current / (projects.length - 1);
      track.current.style.setProperty("--journey", smoothProgress);
      track.current.style.setProperty("--grid-offset", `${-smoothProgress * 160}px`);
      const next = clamp(Math.round(state.current), 0, projects.length - 1);
      if (focus !== next) { focus = next; setActive(next); }
      const { width, height } = element.getBoundingClientRect();
      const aspect = width / height, scale = aspect < 1 ? 0.72 : 1;
      const distance = aspect < 1 ? Math.max(7.2, 4.6 / aspect) : 7.2;
      const perspective = height / (2 * Math.tan(Math.PI / 12));
      const unit = perspective / distance;
      element.style.perspective = `${perspective}px`;
      // Шире шаг спирали и меньше карточки — между соседними объектами есть воздух.
      const position = (d) => ({ x: Math.sin(d * 1.15) * 2.7 * scale, y: -d * 0.95 - 0.12, z: Math.cos(d * 1.15) * 2.3 * scale * 0.95 });
      cards.current.forEach((card, i) => {
        const offset = i - state.current;
        // Дольше держим ближайшую карточку у центра, затем мягко отпускаем по спирали.
        const d = Math.abs(offset) < 1 ? offset ** 3 : offset;
        const p = position(d);
        card.style.width = `${2.05 * scale * unit}px`;
        card.style.height = `${1.28 * scale * unit}px`;
        card.style.transform = `translate(-50%, -50%) rotateX(0.06rad) translate3d(${p.x * unit}px, ${-p.y * unit}px, ${p.z * unit}px) rotateY(${-d * 1.15 * 0.62}rad) rotateX(${-0.04 + d * 0.02}rad) rotateZ(${d * 0.035}rad)`;
        card.style.visibility = Math.abs(offset) < 3.3 ? "visible" : "hidden";
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
    return () => cancelAnimationFrame(frame);
  }, []);
  const goTo = (index) => {
    const top = window.scrollY + track.current.getBoundingClientRect().top;
    const travel = track.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + clamp(index, 0, projects.length - 1) / (projects.length - 1) * travel, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <div className="projects">
      <section className="projects__intro">
        <p className="projects__eyebrow">АНТЕРА / ПОЖАРНАЯ БЕЗОПАСНОСТЬ</p>
        <h1>Безопасность.<br />В каждой детали<span>.</span></h1>
        <div className="projects__intro-bottom"><p>Разрабатываем документацию по пожарной безопасности.<br />От специальных технических условий до рабочих решений.</p><a href="#project-track">Наши направления <span>↓</span></a></div>
        <div className="projects__intro-line" aria-hidden="true" />
      </section>
      <section className="projects__track" ref={track} id="project-track" aria-label="Направления работы">
        <div className="projects__blueprint" aria-hidden="true" />
        <div className="projects__route" aria-hidden="true"><span>ПУТЬ ПРОЕКТА</span><i /></div>
        <div className="projects__milestones" aria-hidden="true">{projects.map((project, i) => <div key={project.tag}><span>+ {String(i + 1).padStart(2, "0")}</span><b>{project.tag}</b><small>АНТЕРА / ПРОЕКТИРОВАНИЕ</small></div>)}</div>
        <div className="projects__viewport">
          <div className="projects__section-label"><span className="projects__eyebrow">01 / НАПРАВЛЕНИЯ</span><span>Всё связано. Каждая деталь важна.</span></div>
          <div className="projects__halo" aria-hidden="true"><i /><i /><i /></div>
          <div className="projects__large-index" aria-hidden="true">{String(active + 1).padStart(2, "0")}</div>
          <svg className="projects__orbit" aria-hidden="true"><path ref={line} /></svg>
          <div className="projects__scene" ref={scene}>
            {projects.map((project, i) => <button className="projects__card" key={project.tag} ref={(node) => { cards.current[i] = node; }} onClick={() => goTo(i)} aria-label={project.title}><img src={project.image} alt="" draggable="false" /><span><small>{String(i + 1).padStart(2, "0")} / {project.tag}</small>{project.title}</span></button>)}
          </div>
          <div className="projects__controls"><p className="projects__description">{projects[active].text}</p><div><button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Предыдущее направление">←</button><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><button onClick={() => goTo(active + 1)} disabled={active === projects.length - 1} aria-label="Следующее направление">→</button></div></div>
        </div>
      </section>
      <section className="projects__process"><p className="projects__eyebrow">02 / ПОДХОД К РАБОТЕ</p><h2>От исходных данных<br />к продуманному решению.</h2><div className="projects__steps">{[["01", "Изучаем объект", "Собираем исходные данные и определяем задачи."], ["02", "Разрабатываем решения", "Увязываем требования, расчёты и проектную документацию."], ["03", "Прорабатываем детали", "Готовим рабочую документацию и сопровождаем решения."]].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="projects__contact"><p className="projects__eyebrow">ОБСУДИМ ВАШ ОБЪЕКТ</p><h2>Начнём с вашей задачи.</h2><Link to="/contacts">Связаться с нами <span>↗</span></Link></section>
    </div>
  );
}
