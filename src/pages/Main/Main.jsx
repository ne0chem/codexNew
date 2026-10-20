import { Link } from "react-router-dom";
import ServicesOrbit from "./ServicesOrbit";
import ServiceApproach from "./ServiceApproach";
import "./Main.css";
function BenefitIcon({ type }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "experience" ? (
        <>
          <circle cx="16" cy="16" r="12" />
          <path d="m10 16 4 4 8-9" />
        </>
      ) : type === "technology" ? (
        <>
          <circle cx="16" cy="16" r="10" />
          <ellipse cx="16" cy="16" rx="4.5" ry="10" />
          <path d="M6 16h20M9 9h14M9 23h14M16 2v4m0 20v4M2 16h4m20 0h4" />
        </>
      ) : (
        <>
          <path d="m16 3 12 7v13l-12 7L4 23V10Zm0 13v14M4 10l12 6 12-6M10 6l12 7" />
        </>
      )}
    </svg>
  );
}
export default function Main() {
  return (
    <div className="home">
      <section className="scene-hero scene-hero--interfaces" id="home">
        <div
          className="scene-hero__background scene-hero__background--css"
          style={{ backgroundImage: "url(/assets/hero-glass-interfaces.png)" }}
          aria-hidden="true"
        />
        <div className="scene-hero__content">
          <span className="scene-hero__eyebrow">
            <i />
          </span>
          <h1>
            IT-решения
            <br />
            под ключ для
            <br />
            <span>вашего бизнеса</span>
          </h1>
          <p>
            Разработка комплексных веб-систем, мобильных приложений и решений
            для корпораций и госструктур
          </p>
          <div className="scene-hero__actions">
            <Link to="/contacts" className="scene-hero__primary">
              Оставить заявку
            </Link>
            <a href="#services" className="scene-hero__secondary">
              Посмотреть услуги
            </a>
          </div>
        </div>
        <div className="scene-hero__advantages" aria-label="Наши преимущества">
          <div>
            <BenefitIcon type="experience" />
            <p>
              Опыт разработки<strong>более 5 лет</strong>
            </p>
          </div>
          <div>
            <BenefitIcon type="technology" />
            <p>
              Современные<strong>технологии</strong>
            </p>
          </div>
          <div>
            <BenefitIcon type="delivery" />
            <p>
              Проекты под<strong>ключ</strong>
            </p>
          </div>
        </div>
      </section>
      <ServiceApproach />
      <ServicesOrbit />
    </div>
  );
}
