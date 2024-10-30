interface Content {
  content?: string;
  explanation?: string;
}

export default async function bracketEdit(file: File): Promise<string> {
  try {
    const jsonData = JSON.parse(await file.text());

    const modifyLatex = (content: string): string => {
      return content
        .replace(/\\$$(.*?matrix.*?)\\$$/g, '\\[$1\\]')
        .replace(/(\[)\s*([.,!?;])/g, '$1 $2')
        .replace(/\\](\s*)(?=[.,!?;])/g, '\\] ')
        .replace(/\\](\s*)([.,!?;])+/g, '$2\\]');
    };

    const processItem = (item: Content & { options?: Content[] }) => {
      if (item.content) item.content = modifyLatex(item.content);
      if (Array.isArray(item.options)) {
        item.options.forEach(option => {
          if (option.content) option.content = modifyLatex(option.content);
          if (option.explanation) option.explanation = modifyLatex(option.explanation);
        });
      }
    };

    jsonData.forEach(processItem);

    console.log('JSON processing completed');
    return JSON.stringify(jsonData, null, 2);
  } catch (err) {
    console.error('Error processing file:', err);
    throw new Error(`Error processing file: ${err}`);
  }
}