import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listShiftQueue from "./tools/list-shift-queue";
import getStudentFeedback from "./tools/get-student-feedback";
import listRequirements from "./tools/list-requirements";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "shift-insight-ai",
  title: "Shift Insight AI",
  version: "0.1.0",
  instructions:
    "Tools for the FISDAP EMS education prototype. Use `list_shift_queue` to view instructor submissions, `get_student_feedback` to read approved feedback reports, and `list_requirements` to check a student's clinical progress.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
    requireOAuthClientClaim: true,
  }),
  tools: [listShiftQueue, getStudentFeedback, listRequirements],
});
