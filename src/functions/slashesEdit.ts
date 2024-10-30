import JSON5 from 'json5';

interface Content {
  content?: string;
  explanation?: string;
}

export default async function fixLatexExpressions(file: File): Promise<string> {
  try {
    const content = await file.text();
    const jsonData = JSON5.parse(content);

    const latexExpressions = [
      '\\theta', '\\sin', '\\cos', '\\tan', '\\alpha', '\\beta', '\\gamma',
      '\\delta', '\\pi', '\\sum', '\\int', '\\frac', '\\sqrt', '\\lim',
      '\\infty', '\\Rightarrow', '\\Leftarrow'
    ];

    const latexRegex = new RegExp(`(?<![a-zA-Z\\\\])(${latexExpressions.map(expr => expr.slice(1)).join('|')})(?![a-zA-Z])`, 'g');

    const modifyLatex = (text: string): string => 
      text.replace(latexRegex, (match) => `\\${match}`);

    const processItem = (item: Content & { options?: Content[] }) => {
      if (item.content) item.content = modifyLatex(item.content);
      if (item.explanation) item.explanation = modifyLatex(item.explanation);
      if (Array.isArray(item.options)) {
        item.options.forEach(option => {
          if (option.content) option.content = modifyLatex(option.content);
          if (option.explanation) option.explanation = modifyLatex(option.explanation);
        });
      }
    };

    jsonData.forEach(processItem);

    return JSON.stringify(jsonData, null, 2);
  } catch (err) {
    console.error('Error processing file:', err);
    throw new Error(`Error processing file: ${err}`);
  }
}