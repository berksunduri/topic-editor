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

const processAndDownloadJsonData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const jsonData = e.target?.result as string;

      try {
        const processedData = (() => {
          try {
            const jsonArray: JsonObject[] = JSON.parse(jsonData);

            const replaceOutsideLatex = (text: string): string => {
              let result = "";
              let inLatex = false;
              let i = 0;

              while (i < text.length) {
                if (!inLatex && text.substring(i, i + 2) === "\\(") {
                  inLatex = true;
                  result += "\\(";
                  i += 2;
                } else if (inLatex && text.substring(i, i + 2) === "\\)") {
                  inLatex = false;
                  result += "\\)";
                  i += 2;
                } else if (!inLatex && text.substring(i, i + 2) === "\\[") {
                  inLatex = true;
                  result += "\\[";
                  i += 2;
                } else if (inLatex && text.substring(i, i + 2) === "\\]") {
                  inLatex = false;
                  result += "\\]";
                  i += 2;
                } else if (!inLatex && text.substring(i, i + 2) === "\\\\") {
                  result += "\\n"; // Replace '\\' with newline
                  i += 2;
                } else {
                  result += text[i];
                  i++;
                }
              }
              return result;
            };

            // Process the JSON array and iterate over 'options' and 'hints'
            const processedArray = jsonArray.map((obj) => {
              return {
                ...obj,
                content:
                  typeof obj.content === "string"
                    ? replaceOutsideLatex(obj.content)
                    : obj.content,
                options: obj.options?.map((option) => ({
                  ...option,
                  content:
                    typeof option.content === "string"
                      ? replaceOutsideLatex(option.content)
                      : option.content,
                  explanation:
                    typeof option.explanation === "string"
                      ? replaceOutsideLatex(option.explanation)
                      : option.explanation,
                }))
              };
            });

            return JSON.stringify(processedArray, null, 2);
          } catch (error) {
            console.error("Error processing the JSON data:", error);
            throw error;
          }
        })();

        resolve(processedData); // Resolve with processed data only
      } catch (error) {
        console.error("Error processing file:", error);
        reject(error); // Reject the promise on error
      }
    };

    reader.readAsText(file);
  });
};

export default processAndDownloadJsonData;
