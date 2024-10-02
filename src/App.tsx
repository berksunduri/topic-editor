import { useState } from 'react'; // Import useState hook
import './App.css';
import updateJsonTopic from './functions/topicEdit';
import processAndDownloadJsonData from './functions/newLineEdit';
import bracketEdit from './functions/bracketEdit'; // Import the new processFile function

function App() {
  const [jsonFile, setJsonFile] = useState<File | null>(null); // State for the JSON file
  const [topic, setTopic] = useState<string>(''); // State for the topic

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 animate-pulse">PDF Topic Editor</h1>
          <div className="mb-6">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Select JSON File:</label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white
                hover:file:bg-gradient-to-r hover:file:from-blue-600 hover:file:to-purple-600
                transition duration-300 ease-in-out
                cursor-pointer"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const file = files[0];
                  setJsonFile(file);
                  console.log("JSON file selected:", file.name);
                }
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">Topic:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              placeholder="Enter topic"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
              onChange={(e) => {
                setTopic(e.target.value);
                console.log("Topic changed:", e.target.value);
              }}
            />
          </div>
          <button 
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 mb-4 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={async () => {
              if (topic && jsonFile) {
                const updatedFile = await updateJsonTopic(topic, jsonFile);
                if (updatedFile !== undefined) {
                  const url = URL.createObjectURL(new Blob([JSON.stringify(updatedFile)], { type: 'application/json' }));
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'updated_file.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              } else {
                console.log("Please enter a topic and select a JSON file");
              }
            }}
          >
            Update Topic
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">New Line Editor</h2>
          <div className="mb-6">
            <label htmlFor="new-line-file-upload" className="block text-sm font-medium text-gray-700 mb-2">Select JSON File:</label>
            <input
              id="new-line-file-upload"
              type="file"
              accept=".json"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-green-500 file:to-teal-500 file:text-white
                hover:file:bg-gradient-to-r hover:file:from-green-600 hover:file:to-teal-600
                transition duration-300 ease-in-out
                cursor-pointer"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const file = files[0];
                  setJsonFile(file);
                  console.log("JSON file selected for new line edit:", file.name);
                }
              }}
            />
          </div>
          <button 
            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={async () => {
              if (jsonFile) {
                const updatedFile = await processAndDownloadJsonData(jsonFile);
                if (updatedFile !== undefined) {
                  const url = URL.createObjectURL(new Blob([JSON.stringify(updatedFile)], { type: 'application/json' }));
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'updated_newline_file.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              } else {
                console.log("Please select a JSON file for new line edit");
              }
            }}
          >
            Update New Lines
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Process JSON File</h2>
          <div className="mb-6">
            <label htmlFor="process-file-upload" className="block text-sm font-medium text-gray-700 mb-2">Select JSON File:</label>
            <input
              id="process-file-upload"
              type="file"
              accept=".json"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-yellow-500 file:to-orange-500 file:text-white
                hover:file:bg-gradient-to-r hover:file:from-yellow-600 hover:file:to-orange-600
                transition duration-300 ease-in-out
                cursor-pointer"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const file = files[0];
                  setJsonFile(file);
                  console.log("JSON file selected for processing:", file.name);
                }
              }}
            />
          </div>
          <button 
            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={async () => {
              if (jsonFile) {
                const modifiedJson = await bracketEdit(jsonFile);
                const url = URL.createObjectURL(new Blob([modifiedJson], { type: 'application/json' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'modified_file.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } else {
                console.log("Please select a JSON file to process");
              }
            }}
          >
            Process JSON
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full">
          {/* Placeholder for the fourth card */}
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Future Feature</h2>
          <p className="text-center text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
