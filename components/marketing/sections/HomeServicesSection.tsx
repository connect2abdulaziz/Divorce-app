import Link from "next/link";
import {
  HELP_OPTIONS,
  HOME_SERVICE_HIGHLIGHTS,
  HOME_SERVICE_LEARN_MORE,
} from "@/lib/marketing/content";

export function HomeServicesSection() {
  return (
    <section className="ldd-home-services" aria-labelledby="home-services-heading">
      <div className="ldd-home-services__inner">
        <p id="home-services-heading" className="ldd-home-services__eyebrow">
          Our services
        </p>

        <div className="ldd-home-services__panel">
          {HELP_OPTIONS.map((service, index) => {
            const isLast = index === HELP_OPTIONS.length - 1;
            const highlights = HOME_SERVICE_HIGHLIGHTS[service.id];

            return (
              <article
                key={service.id}
                className={[
                  "ldd-home-services__row",
                  isLast ? "ldd-home-services__row--last" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="ldd-home-services__main">
                  <h3 className="ldd-home-services__title">{service.title}</h3>
                  <p className="ldd-home-services__description">{service.body}</p>
                  <Link
                    href={HOME_SERVICE_LEARN_MORE[service.id]}
                    className="ldd-home-services__cta"
                  >
                    Learn more
                  </Link>
                </div>

                <div className="ldd-home-services__includes" aria-labelledby={`includes-${service.id}`}>
                  <p id={`includes-${service.id}`} className="ldd-home-services__includes-label">
                    What&apos;s included
                  </p>
                  <ul className="ldd-home-services__list">
                    {highlights.map((item) => (
                      <li key={item} className="ldd-home-services__list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}