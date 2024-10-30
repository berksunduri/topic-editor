import processJsonData from './newLineEdit';
import bracketEdit from './bracketEdit';
import fixLatexExpressions from './slashesEdit';

export async function processCombinedJson(file: File): Promise<string> {
  try {
    // Step 1: Process new lines
    const newLineProcessed = await processJsonData(file);

    // Step 2: Edit matrix brackets
    const bracketProcessed = await bracketEdit(new File([newLineProcessed], file.name, { type: file.type }));

    // Step 3: Fix LaTeX expressions
    const latexFixed = await fixLatexExpressions(new File([bracketProcessed], file.name, { type: file.type }));

    return latexFixed;
  } catch (error) {
    console.error('Error in combined JSON processing:', error);
    throw new Error('Failed to process JSON file');
  }
}