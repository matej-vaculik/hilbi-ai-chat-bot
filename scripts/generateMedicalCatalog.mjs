import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../dev/medicalAnswers.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { medicalAnswers } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const references = [
  ['Medical topics directory', 'https://medlineplus.gov/all_healthtopics.html'],
  ['Symptoms', 'https://medlineplus.gov/symptoms.html'],
  ['Chest pain', 'https://www.nhs.uk/symptoms/chest-pain/'],
  ['Stroke symptoms', 'https://www.nhs.uk/conditions/stroke/symptoms/'],
  ['Anaphylaxis', 'https://www.nhs.uk/conditions/anaphylaxis/'],
  ['Shortness of breath', 'https://www.nhs.uk/symptoms/shortness-of-breath/'],
  ['Back pain', 'https://www.nhs.uk/conditions/back-pain/'],
  ['Seizures', 'https://medlineplus.gov/seizures.html'],
  ['Diabetes', 'https://medlineplus.gov/diabetes.html'],
  ['HbA1c', 'https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/'],
  ['Celiac disease', 'https://medlineplus.gov/celiacdisease.html'],
  ['Mental health', 'https://medlineplus.gov/mentalhealth.html'],
  ['Medicines', 'https://medlineplus.gov/medicines.html'],
  ['Medical tests', 'https://medlineplus.gov/lab-tests/'],
  ['Checkups', 'https://medlineplus.gov/healthcheckup.html'],
];
const tick = String.fromCharCode(96);
const introduction = `# Asclepius medical demo catalog

100 original, prepared educational replies. These are conservative general overviews and prompts for appropriate professional assessment. They are not personalized treatment, clinical triage, a diagnostic engine, or clinically validated patient-care content. No drug doses are supplied. A qualified clinician should review the complete catalog before any patient-care deployment.

Reference material was consulted on 14 October 2026, with particular attention to urgent chest symptoms, stroke, breathing difficulty, anaphylaxis, back-pain red flags, seizures, and medical test interpretation. The references support background information and selected safety wording; their inclusion is not a claim that every reply has received a clinical review.

Keyword matching chooses a topic, with topics 3 to 7 taking priority and skipping the normal demonstration delay. It cannot infer symptom severity, reliably understand negation, or detect every emergency. Unmatched questions receive the symptom-description prompt. Each response can be viewed with ${tick}/demo answer N${tick}, where N is 1 to 100.

Edit ${tick}dev/medicalAnswers.ts${tick} and run ${tick}node scripts/generateMedicalCatalog.mjs${tick} to refresh this document.

## Reference material

${references.map(([title, url]) => `- [${title}](${url})`).join('\n')}

## Replies

`;
const replies = medicalAnswers.map(({ id, topic, keywords, answer }) =>
  `### ${id}. ${topic}\n\nPreview: ${tick}/demo answer ${id}${tick}\n\nKeywords: ${keywords.join(', ')}\n\n${answer}\n`).join('\n');
await writeFile(new URL('../medical-content.md', import.meta.url), introduction + replies, 'utf8');
console.log(`Generated ${medicalAnswers.length} medical replies.`);
