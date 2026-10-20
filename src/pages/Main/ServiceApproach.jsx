import { useEffect, useRef } from "react";
import "./ServiceApproach.css";
const benefits = [
  ["Персональная команда", "На протяжении всего проекта с вами работает выделенная команда специалистов, где у каждого члена команды есть своя зона ответственности. Вы всегда знаете, к кому обратиться по любому вопросу."],
  ["Соблюдение сроков", "Мы ценим ваше время и гарантируем выполнение всех этапов работы в оговоренные сроки."],
  ["Помощь в подготовке", "Сбор всего необходимого для успешного запуска вашего проекта."],
  ["Эффективные решения", "Опираясь на наш опыт, мы подбираем оптимальные ИТ-решения, чтобы ваша система работала чётко, без сбоев и была готова к росту."],
  ["Круглосуточная поддержка", "Наша техническая поддержка доступна 24/7 для решения любых вопросов и проблем. Мы оперативно реагируем на запросы и обеспечиваем бесперебойную работу ваших систем."],
  ["Аналитика и отчетность", "Мы предоставляем детальные отчеты о ходе работы и результатах проекта. Наша система аналитики позволяет отслеживать эффективность и вносить корректировки в реальном времени."],
];
function ApproachIcon({index}) {return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{[
  <g key="team"><circle cx="12" cy="10" r="4"/><path d="M4 26v-3a8 8 0 0 1 16 0v3M21 7a4 4 0 0 1 0 8m3 4a7 7 0 0 1 4 7"/></g>,
  <g key="time"><circle cx="16" cy="16" r="12"/><path d="M16 8v8l5 3"/></g>,
  <g key="prepare"><rect x="7" y="6" width="19" height="23" rx="3"/><path d="M12 6V3h9v3M12 14h9m-9 6h9m-9 5h5"/></g>,
  <g key="solution"><path d="m18 3-12 16h9l-1 10 12-17h-9Z"/></g>,
  <g key="support"><path d="M5 18v-3a11 11 0 0 1 22 0v8a5 5 0 0 1-5 5h-6"/><rect x="3" y="15" width="6" height="10" rx="2"/><rect x="23" y="15" width="6" height="10" rx="2"/></g>,
  <g key="analytics"><path d="M4 4v24h24M10 23v-7m7 7V9m7 14V5"/></g>
][index]}</svg>}
export default function ServiceApproach(){const section=useRef(null);
 useEffect(()=>{const root=section.current;const nodes=root.querySelectorAll("[data-reveal]");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window))return;root.classList.add("approach--animated");const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.12});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect();},[]);
 return <section className="approach" ref={section} aria-labelledby="approach-title"><div className="approach__layout"><div className="approach__intro" data-reveal><span className="approach__eyebrow"><i/> ПОДХОД К РАБОТЕ</span><h2 id="approach-title">Сервис — наша<br/><span>сильная сторона.</span></h2><p>Мы создаём не просто продукты, а выстраиваем долгосрочные отношения с клиентами, обеспечивая безупречный сервис на всех этапах сотрудничества.</p><p>Наша команда экспертов всегда готова предложить инновационные решения для вашего бизнеса.</p><div className="approach__signature" aria-hidden="true"><span>CODEXTECH</span><i/><span>РЯДОМ НА КАЖДОМ ЭТАПЕ</span></div></div><div className="approach__list">{benefits.map(([title,text],index)=><article className="approach__item" key={title} data-reveal style={{"--reveal-delay": `${index%2*90}ms`}}><div className="approach__item-top"><span className="approach__number">{String(index+1).padStart(2,"0")}</span><ApproachIcon index={index}/></div><h3>{title.slice(0, title.lastIndexOf(" ")+1)}<span className="approach__title-accent">{title.slice(title.lastIndexOf(" ")+1)}</span></h3><p>{text}</p></article>)}</div></div></section>
}
