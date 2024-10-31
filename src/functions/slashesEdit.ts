import JSON5 from "json5";

interface Content {
  content?: string;
  explanation?: string;
}

interface JsonItem extends Content {
  options?: Content[];
}

export default async function fixLatexExpressions(file: File): Promise<string> {
  try {
    const content = await file.text();
    const jsonData = JSON5.parse(content) as JsonItem[];

    const latexExpressions = [
      "\\theta",
      "\\sin",
      "\\cos",
      "\\tan",
      "\\alpha",
      "\\beta",
      "\\gamma",
      "\\delta",
      "\\pi",
      "\\sum",
      "\\int",
      "\\frac",
      "\\sqrt",
      "\\lim",
      "\\infty",
      "\\Rightarrow",
      "\\Leftarrow",
    ];

    const latexRegex = new RegExp(
      `(?<![a-zA-Z\\\\])(${latexExpressions
        .map((expr) => expr.slice(1))
        .join("|")})(?![a-zA-Z])`,
      "g"
    );

    const modifyLatex = (text: string): string =>
      text.replace(latexRegex, (match) => `\\${match}`);

    const processItem = (item: JsonItem): void => {
      if (typeof item.content === "string") {
        item.content = modifyLatex(item.content);
      }
      if (typeof item.explanation === "string") {
        item.explanation = modifyLatex(item.explanation);
      }
      if (Array.isArray(item.options)) {
        item.options.forEach((option) => {
          if (typeof option.content === "string") {
            option.content = modifyLatex(option.content);
          }
          if (typeof option.explanation === "string") {
            option.explanation = modifyLatex(option.explanation);
          }
        });
      }
    };

    jsonData.forEach(processItem);

    return JSON.stringify(jsonData, null, 2);
  } catch (err) {
    console.error("Error processing file:", err);
    throw new Error(
      `Error processing file: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
