import JSON5 from 'json5';

interface Option {
  content: string;
  isCorrect: boolean;
  explanation?: string;
}

interface JsonObject {
  content?: string;
  type?: string;
  tags?: string[];
  topics?: string[];
  taxonomyAspect?: string;
  complexityLevel?: string;
  options?: Option[];
}

const processJsonData = async (file: File): Promise<string> => {
  try {
    const jsonData = await file.text();
    const jsonArray: JsonObject[] = JSON5.parse(jsonData);

    const replaceOutsideLatex = (text: string): string => {
      const latexRegex = /\\[$$[].*?\\[$$\]]/gs;
      const parts = text.split(latexRegex);
      const matches = text.match(latexRegex) || [];

      return parts.map((part, index) => {
        const processedPart = part.replace(/\\\\/g, '\\n');
        return index < matches.length ? processedPart + matches[index] : processedPart;
      }).join('');
    };

    const processedArray = jsonArray.map(obj => ({
      ...obj,
      content: typeof obj.content === 'string' ? replaceOutsideLatex(obj.content) : obj.content,
      options: obj.options?.map(option => ({
        ...option,
        content: typeof option.content === 'string' ? replaceOutsideLatex(option.content) : option.content,
        explanation: typeof option.explanation === 'string' ? replaceOutsideLatex(option.explanation) : option.explanation,
      }))
    }));

    return JSON.stringify(processedArray, null, 2);
  } catch (error) {
    console.error("Error processing the JSON data:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to process JSON data: ${error.message}`);
    } else {
      throw new Error("Failed to process JSON data: Unknown error");
    }
  }
};

export default processJsonData;