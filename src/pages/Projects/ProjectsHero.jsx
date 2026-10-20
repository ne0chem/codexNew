import { useEffect, useRef } from "react";
import "./ProjectsHero.css";

export default function ProjectsHero() {
  const hero = useRef(null);
  useEffect(() => {
    const element = hero.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    const update = () => {
      frame = null;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      const exit = Math.min(1, progress / 0.8);
      const easedExit = exit * exit * (3 - 2 * exit);
      document.body.classList.toggle("projects-hero-dark", rect.bottom > 90 && rect.top < window.innerHeight);
      element.style.setProperty("--hero-shift", `${reduced.matches ? 0 : -easedExit * 40}px`);
      element.style.setProperty("--hero-copy-opacity", reduced.matches ? 1 : Math.max(0, 1 - easedExit * 1.5));
      element.style.setProperty("--hero-image-opacity", reduced.matches ? 1 : 1 - easedExit * 0.78);
      element.style.setProperty("--reflection-lift", `${reduced.matches ? 0 : -easedExit * 100}px`);
      element.style.setProperty("--reflection-glow", reduced.matches ? 0 : Math.sin(exit * Math.PI) * 0.32);
      element.style.setProperty("--reflection-veil", easedExit);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); document.body.classList.remove("projects-hero-dark"); };
  }, []);

  return (
    <section className="project-hero" ref={hero} aria-labelledby="project-hero-title">
      <div className="project-hero__light" aria-hidden="true" />
      <div className="project-hero__draft" aria-hidden="true">
        <span className="project-hero__circle" />
        <span className="project-hero__axis" />
        <span className="project-hero__cross project-hero__cross--one">+</span>
        <span className="project-hero__cross project-hero__cross--two">+</span>
      </div>
      <div className="project-hero__architecture" aria-hidden="true">
        <img src="/assets/projects-hero-building-water.png" alt="" fetchPriority="high" draggable="false" />
        <div className="project-hero__water-light" />
      </div>
      <div className="project-hero__copy">
        <p className="project-hero__eyebrow"><span />ПРОЕКТЫ АНТЕРА</p>
        <h1 id="project-hero-title">От замысла<br />к реализации.</h1>
        <p className="project-hero__caption">Проектные решения для объектов<br />различного назначения и сложности.</p>
      </div>
      <div className="project-hero__reflection-transition" aria-hidden="true"><i /><i /><i /></div>

    </section>
  );
}
