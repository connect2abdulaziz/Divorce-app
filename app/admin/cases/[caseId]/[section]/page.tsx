import { notFound } from "next/navigation";
import { GatedRepeatableStep } from "@/components/questionnaire/GatedRepeatableStep";
import { ClientInfoForm } from "@/app/questionnaire/client-info/Form";
import { SpouseInfoForm } from "@/app/questionnaire/spouse-info/Form";
import { MarriageForm } from "@/app/questionnaire/marriage/Form";
import { EmploymentForm } from "@/app/questionnaire/employment/Form";
import { DomesticViolenceForm } from "@/app/questionnaire/domestic-violence/Form";
import { ChildrenForm } from "@/app/questionnaire/children/Form";
import { ParentingForm } from "@/app/questionnaire/parenting/Form";
import { TaxInformationForm } from "@/app/questionnaire/tax-information/Form";
import { requireStaff } from "@/lib/admin/current-staff";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import {
  REPEATABLE_SECTION_CONFIGS,
  type RepeatableSectionSlug,
} from "@/lib/questionnaire/repeatable-configs";

export default async function AdminSectionEditPage({
  params,
}: {
  params: Promise<{ caseId: string; section: string }>;
}) {
  await requireStaff();
  const { caseId, section } = await params;
  const backHref = `/admin/cases/${caseId}`;
  const nav = {
    backHref,
    backLabel: "Back to case",
    nextHref: backHref,
    submitLabel: "Save & return",
  };

  const { sections, records, gates } = await loadCaseBundle(caseId);

  if (section in REPEATABLE_SECTION_CONFIGS) {
    const cfg = REPEATABLE_SECTION_CONFIGS[section as RepeatableSectionSlug];
    return (
      <div className="max-w-3xl">
        <GatedRepeatableStep
          caseId={caseId}
          slug={cfg.slug}
          {...nav}
          title={cfg.title}
          subtitle={cfg.subtitle}
          gateColumn={cfg.gateColumn}
          gateQuestion={cfg.gateQuestion}
          table={cfg.table}
          addLabel={cfg.addLabel}
          emptyLabel={cfg.emptyLabel}
          fields={cfg.fields}
          summary={cfg.summary}
          gateValue={gates[cfg.gateKey] as boolean | null}
          records={records[cfg.recordKey] as Array<Record<string, unknown> & { id: string }>}
        />
      </div>
    );
  }

  const form = (() => {
    switch (section) {
      case "client-info":
        return <ClientInfoForm caseId={caseId} slug={section} {...nav} initial={sections.party_client!} />;
      case "spouse-info":
        return <SpouseInfoForm caseId={caseId} slug={section} {...nav} initial={sections.party_spouse!} />;
      case "marriage":
        return (
          <MarriageForm
            caseId={caseId}
            slug={section}
            {...nav}
            initial={sections.marriage!}
            initialPregnant={gates.isSpousePregnant}
          />
        );
      case "employment":
        return <EmploymentForm caseId={caseId} slug={section} {...nav} initial={sections.employment!} />;
      case "domestic-violence":
        return (
          <DomesticViolenceForm caseId={caseId} slug={section} {...nav} initial={sections.domestic_violence!} />
        );
      case "children":
        return (
          <ChildrenForm
            caseId={caseId}
            slug={section}
            {...nav}
            gateValue={gates.hasCommonChildren}
            kids={records.children}
          />
        );
      case "parenting":
        return <ParentingForm caseId={caseId} slug={section} {...nav} initial={sections.parenting!} />;
      case "tax-information":
        return <TaxInformationForm caseId={caseId} slug={section} {...nav} initial={sections.tax_information!} />;
      default:
        return null;
    }
  })();

  if (!form) notFound();

  return <div className="max-w-3xl">{form}</div>;
}
