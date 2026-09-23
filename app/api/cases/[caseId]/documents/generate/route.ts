import { NextResponse } from "next/server";
import { generateCaseDocuments } from "@/lib/documents/generate";
import { isStaffRole } from "@/lib/admin/current-staff";
import { getOwnedCase } from "@/lib/cases";
import { loadCaseBundle } from "@/lib/questionnaire/data";
import { createClient } from "@/lib/supabase/server";
import type { DecreePath, PackStep } from "@/lib/documents/catalog";

type Body = {
  decreePath?: DecreePath;
  steps?: PackStep[] | "filing" | "full";
  includeOptional?: boolean;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role?: string } | null)?.role;
  const staff = isStaffRole(role);

  if (!staff) {
    const owned = await getOwnedCase(user.id, caseId);
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const steps: PackStep[] | undefined =
    body.steps === "full"
      ? ["filing", "service", "default", "decree"]
      : body.steps === "filing"
        ? ["filing"]
        : Array.isArray(body.steps)
          ? body.steps
          : ["filing"];

  try {
    const bundle = await loadCaseBundle(caseId);
    const result = await generateCaseDocuments(bundle, {
      decreePath: body.decreePath ?? "default_decree",
      steps,
      includeOptional: body.includeOptional ?? false,
    });

    return new NextResponse(Buffer.from(result.pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${result.fileName}"`,
        "X-Doc-Track": result.track,
        "X-Doc-Forms": String(result.forms.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
