/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs-extra';

interface Content {
  content?: string;
  explanation?: string;
}

// Function to modify LaTeX expressions
function modifyLatex(content: string): string {
  const regex = /\\\((.*?)\\\)/g; // Match content inside \( and \)
  return content.replace(regex, (match, p1) => {
    if (p1.includes('matrix')) {
      return `\\[${p1}\\]`;
    }
    return match;
  });
}

// Function to process a single JSON file and write to a new file
export default async function bracketEdit(inputFilePath: string): Promise<void> {
  try {
    const jsonData = await fs.readJson(inputFilePath);

    jsonData.forEach((item: any) => {
      // Check if `content` and `explanation` exist before modifying them
      if (item.content) {
        item.content = modifyLatex(item.content);
      }

      if (item.explanation) {
        item.explanation = modifyLatex(item.explanation);
      }

      // Check and modify contents in nested objects (e.g., hints, options)
      if (item.hints && Array.isArray(item.hints)) {
        item.hints.forEach((hint: Content) => {
          if (hint.content) {
            hint.content = modifyLatex(hint.content);
          }
        });
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

    // Generate a new file name by appending '_modified' to the original file name
    const outputFilePath = inputFilePath.replace(/\.json$/, '_modified.json');

    // Write the updated content to the new file
    await fs.writeJson(outputFilePath, jsonData, { spaces: 2 });
    console.log(`Created new file: ${outputFilePath}`);
  } catch (err) {
    console.error(`Error processing file ${inputFilePath}:`, err);
  }
}
