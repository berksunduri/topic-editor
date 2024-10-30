async function updateJsonTopic(newTopic: string, file: File): Promise<string> {
    try {
      const data = await file.text();
      const jsonData = JSON.parse(data);
  
      if (!Array.isArray(jsonData)) {
        throw new Error("The JSON data is not an array.");
      }
  
      jsonData.forEach((obj) => {
        obj.topics = [newTopic];
      });
  
      const updatedJsonData = JSON.stringify(jsonData, null, 2);
      console.log("Successfully updated the 'topic' field for all objects.");
      return updatedJsonData;
    } catch (error) {
      console.error("Error processing the JSON file:", error);
      throw new Error("Failed to update JSON topics");
    }
  }
  
  export default updateJsonTopic;