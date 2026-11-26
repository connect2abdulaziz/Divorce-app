import { DIY_SERVICE_BENEFITS } from "@/lib/marketing/content";
import { Icon } from "@/components/marketing/ui/Icon";

type BenefitItem = {
  id: string;
  icon: Parameters<typeof Icon>[0]["name"];
  title: string;
  body: string;
};

export function ServiceBenefitsPanel({
  heading = "Designed to make divorce paperwork a little simpler.",
  benefits = DIY_SERVICE_BENEFITS,
}: {
  heading?: string;
  benefits?: readonly BenefitItem[];
}) {
  return (
    <section className="ldd-svc-benefits" aria-labelledby="svc-benefits-heading">
      <div className="ldd-svc-benefits__outer">
        <div className="ldd-svc-benefits__panel">
          <div className="ldd-svc-benefits__intro">
            <h2 id="svc-benefits-heading" className="ldd-svc-benefits__heading">
              {heading}
            </h2>
          </div>
          <div className="ldd-svc-benefits__list">
            {benefits.map((item, index) => (
              <div key={item.id} className="ldd-svc-benefits__row">
                <Icon name={item.icon} size={22} className="ldd-svc-benefits__row-icon" />
                <div className="ldd-svc-benefits__row-copy">
                  <p className="ldd-svc-benefits__row-title">{item.title}</p>
                  <p className="ldd-svc-benefits__row-body">{item.body}</p>
                </div>
                {index < benefits.length - 1 ? (
                  <hr className="ldd-svc-benefits__row-rule" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}