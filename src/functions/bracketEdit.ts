  interface Content {
    content?: string;
    explanation?: string;
  }

  export default async function bracketEdit(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);

          jsonData.forEach((item: Content & { options?: Content[] }) => {
            if (item.content) {
              item.content = modifyLatex(item.content);
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
          console.log('JSON processing completed');
          resolve(modifiedJson);
        } catch (err) {
          console.error(err);
          reject(`Error processing file: ${err}`);
        }
      };

      reader.onerror = (error) => {
        reject(`Error reading file: ${error}`);
      };

      reader.readAsText(file);
    });

    function modifyLatex(content: string): string {
      const regex = /\\\((.*?)\\\)/g; // Match content inside \( and \)
    
      return content
        .replace(regex, (match, p1) => {
          if (p1.includes('matrix')) {
            return `\\[${p1}\\]`; // Change \( to \[ for matrices
          }
          return match; // Return the original match for non-matrix content
        })
        .replace(/(\[)(\s*?)([.,!?;])+/g, (p1, p3) => { 
          return `${p1} ${p3}`; // Bring punctuation inside with space
        })
        .replace(/\\](\s*)(?=[.,!?;])/g, '\\] ') // Ensure space before punctuation after the bracket
    
        // New edit to place punctuation before the closing bracket and double slashes
        .replace(/\\](\s*)([.,!?;])+/g, '$2\\]'); // Move punctuation before the closing bracket
    }
    
  }