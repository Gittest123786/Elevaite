
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export const generateDocxCV = async (cvData) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: cvData.personalInfo.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${cvData.personalInfo.contact} | ${cvData.personalInfo.location}`),
            ],
          }),
          new Paragraph({ text: "" }), // Spacer

          // Summary
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun(cvData.professionalSummary)],
          }),
          new Paragraph({ text: "" }), // Spacer

          // Experience
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
          }),
          ...cvData.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                new TextRun({ text: ` | ${exp.company} (${exp.duration})`, italics: true }),
              ],
            }),
            ...exp.achievements.map(
              (ach) =>
                new Paragraph({
                  text: ach,
                  bullet: { level: 0 },
                })
            ),
            new Paragraph({ text: "" }), // Spacer
          ]),

          // Education
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
          }),
          ...cvData.education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution, bold: true }),
                new TextRun({ text: ` - ${edu.degree} (${edu.year})` }),
              ],
            }),
          ]),
          new Paragraph({ text: "" }), // Spacer

          // Skills
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: cvData.skills.join(", "),
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cvData.personalInfo.name.replace(/\s+/g, "_")}_CV_elevAIte.docx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
