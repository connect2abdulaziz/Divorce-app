import { DIY_SERVICE_IDEAL_FOR } from "@/lib/marketing/content";
import { Icon } from "@/components/marketing/ui/Icon";

export function ServiceIdealStrip({
  statements = DIY_SERVICE_IDEAL_FOR,
}: {
  statements?: readonly string[];
}) {
  return (
    <section className="ldd-svc-ideal" aria-labelledby="svc-ideal-label">
      <div className="ldd-svc-ideal__inner">
        <div className="ldd-svc-ideal__cell ldd-svc-ideal__cell--label">
          <Icon name="check" size={18} className="ldd-svc-ideal__icon" />
          <p id="svc-ideal-label" className="ldd-svc-ideal__label">
            IDEAL FOR PEOPLE WHO:
          </p>
        </div>
        {statements.map((text) => (
          <div key={text} className="ldd-svc-ideal__cell">
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}