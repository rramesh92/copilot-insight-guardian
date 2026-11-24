# Shift Insight AI

Prompt:

Design an interactive prototype mock for an EMS education platform feature called AI Shift Feedback Copilot for FISDAP. The experience should feel enterprise, clinical, and instructor-focused, with a clean dashboard UI suitable for healthcare education. Use a serious, trustworthy visual style: white background, muted blues and grays, clear hierarchy, lots of spacing, and accessible typography. Avoid playful illustrations; use a professional academic/clinical look.

Product context

FISDAP is used by EMS instructors and students for shift tracking, competency tracking, assessments, testing, and reporting. This feature helps instructors review student shift logs faster by drafting narrative feedback from logged patient encounter data, while preserving human approval as the final step.

Core UX goal

Show how an instructor reviews a student’s shift entry, sees an AI-generated draft feedback summary, checks for data quality issues, edits the draft, and approves the final feedback. The design must make it obvious that AI does not auto-publish or auto-sign off competency. Instructor approval is mandatory.

Screens to include

Instructor dashboard

List of recent student shift submissions needing review.

Status badges such as “AI Draft Ready,” “Needs Data Check,” “Instructor Review Pending.”

Filters for cohort, course, date, and competency type.

Shift review detail page

Left panel: student encounter data including chief complaint, vitals, interventions, patient age group, attachments, and timestamps.

Center panel: AI-generated draft narrative feedback and suggested competency alignment.

Right panel: rubric/competency checklist with evidence links.

Highlight uncertain or incomplete fields in amber with tooltips.

Data quality warning state

If vitals or patient details look incomplete, show a visible warning banner: “AI draft generated from partial data. Instructor must verify before approval.”

Include specific missing fields and a “request clarification” action.

Instructor edit and approval flow

Editable text area for narrative feedback.

Suggested competency score shown as a draft, not final.

Buttons: “Edit Draft,” “Mark Needs Correction,” “Approve Final Feedback.”

Approval confirmation modal stating: “Instructor review required. AI draft is not published until approved.”

Interaction behavior

Clicking a student opens the shift review page.

AI draft loads with a short explanation of why the competency was suggested.

Missing data is surfaced before the instructor can approve.

Instructor can edit any text.

Approval requires an explicit final confirm step.

If data is incomplete, the mock should encourage correction rather than pretend certainty.

Labels and microcopy

Use concise, credible microcopy such as:

“AI draft for review only.”

“Instructor approval required.”

“Data completeness check.”

“Suggested competency mapping.”

“Final score locked after approval.”

Design details

Desktop-first layout.

Use cards, tables, side panels, and approval banners.

Make the review workflow visually clear in 3 steps: Review, Edit, Approve.

Show one example student with a realistic EMS case.

Include one incomplete-data example to demonstrate safety and transparency.

Important constraints

Do not imply autonomous grading.

Do not imply AI-generated feedback is the source of record.

Emphasize that the instructor retains final authority over feedback and competency sign-off.

The design should feel like a real product prototype, not a marketing page.

Output expectation

Create a polished, interactive prototype mock with clickable states, annotated UI elements, and a clear instructor workflow from submission to approval. The result should communicate workload reduction, quality control, and compliance-safe AI assistance.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://copilot-insight-guardian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ff96cabc-5f12-4450-8f4f-cc0a69341293).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
