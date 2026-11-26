import { DIY_SERVICE_CIRCUMSTANCES } from "@/lib/marketing/content";

type CircumstanceItem = { title: string; body: string };

export function ServiceCircumstancesBand({
  titleLine1 = "Every divorce is different.",
  titleLine2 = "Your paperwork should reflect that.",
  lede = "Our guided questionnaire adapts to the information you provide, helping prepare documents that reflect your Arizona divorce circumstances.",
  items = DIY_SERVICE_CIRCUMSTANCES,
}: {
  titleLine1?: string;
  titleLine2?: string;
  lede?: string;
  items?: readonly CircumstanceItem[];
}) {
  return (
    <section className="ldd-svc-circumstances" aria-labelledby="svc-circumstances-heading">
      <div className="ldd-svc-circumstances__inner">
        <h2 id="svc-circumstances-heading" className="ldd-svc-circumstances__title">
          {titleLine1}
          <span className="ldd-svc-circumstances__title-line">{titleLine2}</span>
        </h2>
        <p className="ldd-svc-circumstances__lede">{lede}</p>
        <hr className="ldd-svc-circumstances__rule" aria-hidden="true" />
        <div className="ldd-svc-circumstances__grid">
          {items.map((item) => (
            <div key={item.title} className="ldd-svc-circumstances__cell">
              <h3 className="ldd-svc-circumstances__cell-title">{item.title}</h3>
              <p className="ldd-svc-circumstances__cell-body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}