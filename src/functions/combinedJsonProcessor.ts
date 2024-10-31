import processJsonData from "./newLineEdit";
import bracketEdit from "./bracketEdit";
import fixLatexExpressions from "./slashesEdit";

export async function processCombinedJson(file: File): Promise<string> {
  try {
    const newLineProcessed = await processJsonData(file);

    const bracketProcessed = await bracketEdit(
      new File([newLineProcessed], file.name, { type: file.type })
    );

    const latexFixed = await fixLatexExpressions(
      new File([bracketProcessed], file.name, { type: file.type })
    );

    return latexFixed;
  } catch (error) {
    console.error("Error in combined JSON processing:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to process JSON file: ${error.message}`);
    } else {
      throw new Error("Failed to process JSON file: Unknown error");
    }
  }
}
