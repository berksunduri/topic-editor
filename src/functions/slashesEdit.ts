import JSON5 from 'json5';

interface Content {
  content?: string;
  explanation?: string;
}

export default async function fixLatexExpressions(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;

      try {
        // try to fix this broken JSON with json5
        const jsonData = JSON5.parse(content);

        // process the JSON as before
        jsonData.forEach((item: Content & { options?: Content[] }) => {
          if (item.content) {
            item.content = modifyLatex(item.content);
          }
          if (item.explanation) {
            item.explanation = modifyLatex(item.explanation);
          }
          if (item.options && Array.isArray(item.options)) {
            item.options.forEach((option: Content) => {
              if (option.content) {
                option.content = modifyLatex(option.content);
              }
              if (option.explanation) {
                option.explanation = modifyLatex(option.explanation);
              }
            });
          }
        });

        const modifiedJson = JSON.stringify(jsonData, null, 2);
        resolve(modifiedJson);
      } catch (err) {
        console.error('Error processing file:', err);
        reject(`Error processing file: ${err}`);
      }
    };

    reader.onerror = (error) => {
      reject(`Error reading file: ${error}`);
    };

    reader.readAsText(file);
  });

  function modifyLatex(content: string): string {
    const latexExpressions = [
      '\\theta',
      '\\sin',
      '\\cos',
      '\\tan',
      '\\alpha',
      '\\beta',
      '\\gamma',
      '\\delta',
      '\\pi',
      '\\sum',
      '\\int',
      '\\frac',
      '\\sqrt',
      '\\lim',
      '\\infty',
      '\\Rightarrow',
      '\\Leftarrow',
    ];

    latexExpressions.forEach((expr) => {
      const singleSlashRegex = new RegExp(`(?<![a-zA-Z\\\\])${expr.slice(1)}(?![a-zA-Z])`, 'g');
      content = content.replace(singleSlashRegex, expr);
    });

    return content;
  }
}