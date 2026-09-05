"use client";

import { useRouter } from "next/navigation";
import { saveSingletonSection } from "@/lib/questionnaire/actions";
import { Field, TextInput } from "@/components/questionnaire/fields";
import { StepShell } from "@/components/questionnaire/StepShell";

type PartyClient = {
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
};

export function ClientInfoForm({
  caseId,
  slug,
  backHref,
  backLabel,
  nextHref,
  submitLabel,
  initial,
}: {
  caseId: string;
  slug: string;
  backHref: string | null;
  backLabel?: string;
  nextHref: string;
  submitLabel?: string;
  initial: PartyClient;
}) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    await saveSingletonSection("party_client", caseId, values, slug);
    router.push(nextHref);
  }

  return (
    <StepShell
      title="Your Information"
      backHref={backHref}
      backLabel={backLabel}
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First name">
          <TextInput name="first_name" defaultValue={initial.first_name} required />
        </Field>
        <Field label="Last name">
          <TextInput name="last_name" defaultValue={initial.last_name} required />
        </Field>
      </div>
      <Field label="Date of birth">
        <TextInput name="date_of_birth" type="date" defaultValue={initial.date_of_birth} required />
      </Field>
      <Field label="Address">
        <TextInput name="address_line1" defaultValue={initial.address_line1} placeholder="Street address" required />
      </Field>
      <Field label="Apartment or suite">
        <TextInput name="address_line2" defaultValue={initial.address_line2} placeholder="Optional" />
      </Field>
      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="City">
          <TextInput name="city" defaultValue={initial.city} required />
        </Field>
        <Field label="State">
          <TextInput name="state" defaultValue={initial.state ?? "AZ"} required />
        </Field>
        <Field label="ZIP">
          <TextInput name="zip" defaultValue={initial.zip} required />
        </Field>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone">
          <TextInput name="phone" type="tel" defaultValue={initial.phone} required />
        </Field>
        <Field label="Email">
          <TextInput name="email" type="email" defaultValue={initial.email} required />
        </Field>
      </div>
    </StepShell>
  );
}
