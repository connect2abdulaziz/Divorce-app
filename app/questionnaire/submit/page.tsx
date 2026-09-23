import { redirect } from "next/navigation";

/** Submit is now part of the Review page so users confirm while seeing their answers. */
export default function SubmitPage() {
  redirect("/questionnaire/review");
}
