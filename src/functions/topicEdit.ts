function updateJsonTopic(newTopic: string, file: File) {
    const reader = new FileReader();

    // Read the contents of the file
    reader.onload = (event) => {
        const data = event.target?.result;
        if (typeof data === 'string') {
            try {
                // Parse the JSON file into an array of objects
                const jsonData = JSON.parse(data);

                // Ensure jsonData is an array
                if (Array.isArray(jsonData)) {
                    jsonData.forEach((obj) => {
                        obj.topics = [newTopic]; // Ensure the topic name is in brackets even if it's a single topic
                    });

                    // Convert the updated data back to JSON
                    const updatedJsonData = JSON.stringify(jsonData, null, 4);

                    // Create a new Blob with the updated JSON data
                    const blob = new Blob([updatedJsonData], { type: 'application/json' });
                    const newFilePath = `updated_topics.json`;
                    
                    // Create a link to download the new file
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = newFilePath; // Set the filename for the download
                    document.body.appendChild(a);
                    a.click(); // Programmatically click the link to trigger the download
                    document.body.removeChild(a); // Clean up the DOM
                    URL.revokeObjectURL(url); // Release the object URL
                    console.log("Successfully created a new file with the updated 'topic' field for all objects.");
                } else {
                    console.error("The JSON data is not an array.");
                }
            } catch (parseError) {
                console.error("Error parsing the JSON file:", parseError);
            }
        }
    };

    // Read the file as text
    reader.readAsText(file);
}

export default updateJsonTopic;
