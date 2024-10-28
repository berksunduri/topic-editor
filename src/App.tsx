import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import updateJsonTopic from "./functions/topicEdit";
import processAndDownloadJsonData from "./functions/newLineEdit";
import bracketEdit from "./functions/bracketEdit";
import fixLatexExpressions from "./functions/slashesEdit";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function JsonProcessor() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [topic, setTopic] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [embedLink, setEmbedLink] = useState("");

  const [tutorialTopic, setTutorialTopic] = useState("");
  const [tutorialYoutubeLink, setTutorialYoutubeLink] = useState("");
  const [tutorialTitle, setTutorialTitle] = useState("");
  const [tutorialSourceType, setTutorialSourceType] = useState("");
  const [tutorialJson, setTutorialJson] = useState("");

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setJsonFile(files[0]);
    }
  };

  const processFile = async (
    processor: (file: File) => Promise<string>,
    filename: string
  ) => {
    if (!jsonFile) {
      console.log("Please select a JSON file");
      return;
    }

    try {
      const modifiedJson = await processor(jsonFile);
      const url = URL.createObjectURL(
        new Blob([modifiedJson], { type: "application/json" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const convertYoutubeLink = () => {
    const videoId = youtubeLink.split("v=")[1];
    if (!videoId) {
      setEmbedLink("Invalid YouTube link");
      return;
    }

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const params = [];

    if (startTime) {
      const startSeconds = convertTimeToSeconds(startTime);
      if (startSeconds !== null) params.push(`start=${startSeconds}`);
    }

    if (endTime) {
      const endSeconds = convertTimeToSeconds(endTime);
      if (endSeconds !== null) params.push(`end=${endSeconds}`);
    }

    if (params.length > 0) {
      embedUrl += `?${params.join("&")}`;
    }

    setEmbedLink(embedUrl);
  };

  const convertTimeToSeconds = (time: string): number | null => {
    const parts = time.split(":").map((part) => parseInt(part, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return null;
  };

  useEffect(() => {
    if (tutorialYoutubeLink) {
      // Determine the source type based on the link
      if (tutorialYoutubeLink.includes("youtube.com")) {
        setTutorialSourceType("youtube");
      } else if (tutorialYoutubeLink.includes("khanacademy.org")) {
        setTutorialSourceType("khan_academy");
      } else {
        setTutorialSourceType("other");
      }

      // Generate the JSON
      const jsonStructure = {
        topic: tutorialTopic,
        sourceType: tutorialSourceType,
        title: tutorialTitle,
        url: tutorialYoutubeLink,
      };
      setTutorialJson(JSON.stringify(jsonStructure, null, 2));
    }
  }, [tutorialTopic, tutorialYoutubeLink, tutorialTitle, tutorialSourceType]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tutorialJson);
      toast({
        title: "Copied to clipboard",
        description: "The JSON content has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the JSON content. Please try again.",
      });
    }
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        JSON File Processor
      </h1>
      <Tabs defaultValue="topic">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="topic">Topic Editor</TabsTrigger>
          <TabsTrigger value="newline">New Line Editor</TabsTrigger>
          <TabsTrigger value="bracket">Matrix Bracket Editor</TabsTrigger>
          <TabsTrigger value="latex">LaTeX Fixer</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Embedder</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial Creator</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-6">
            <TabsContent value="topic">
              <CardHeader>
                <CardTitle>PDF Topic Editor</CardTitle>
                <CardDescription>
                  Edits all topics in the JSON file to the desired text. This
                  will update all topic fields simultaneously.
                </CardDescription>
              </CardHeader>
              <div className="mb-6">
                <Label htmlFor="file-upload">Select JSON File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="mt-2 input-file"
                />
              </div>
              <div className="mb-6">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={() =>
                  processFile(
                    (file) => updateJsonTopic(topic, file),
                    "updated_topic_file.json"
                  )
                }
                className="w-full button"
              >
                Update Topic
              </Button>
            </TabsContent>
            <TabsContent value="newline">
              <CardHeader>
                <CardTitle>New Line Editor</CardTitle>
                <CardDescription>
                  Removes '\n' characters inside KaTeX expressions. This helps
                  to ensure proper rendering of mathematical formulas.
                </CardDescription>
              </CardHeader>
              <div className="mb-6">
                <Label htmlFor="file-upload-newline">Select JSON File</Label>
                <Input
                  id="file-upload-newline"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="mt-2 input-file"
                />
              </div>
              <Button
                onClick={() =>
                  processFile(
                    processAndDownloadJsonData,
                    "updated_newline_file.json"
                  )
                }
                className="w-full button"
              >
                Remove New Lines in KaTeX
              </Button>
            </TabsContent>
            <TabsContent value="bracket">
              <CardHeader>
                <CardTitle>Matrix Bracket Editor</CardTitle>
                <CardDescription>
                  Finds matrices inside KaTeX expressions and changes their
                  brackets to '\[' and '\]'. This improves the display of
                  matrices in LaTeX.
                </CardDescription>
              </CardHeader>
              <div className="mb-6">
                <Label htmlFor="file-upload-bracket">Select JSON File</Label>
                <Input
                  id="file-upload-bracket"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="mt-2 input-file"
                />
              </div>
              <Button
                onClick={() =>
                  processFile(bracketEdit, "modified_bracket_file.json")
                }
                className="w-full button"
              >
                Update Matrix Brackets
              </Button>
            </TabsContent>
            <TabsContent value="latex">
              <CardHeader>
                <CardTitle>LaTeX Expression Fixer</CardTitle>
                <CardDescription>
                  Fixes slash-related errors in LaTeX expressions. For example,
                  it will change '\cos' to '\\cos', ensuring proper LaTeX
                  rendering.
                </CardDescription>
              </CardHeader>
              <div className="mb-6">
                <Label htmlFor="file-upload-latex">Select JSON File</Label>
                <Input
                  id="file-upload-latex"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="mt-2 input-file"
                />
              </div>
              <Button
                onClick={() =>
                  processFile(fixLatexExpressions, "latex_fixed_file.json")
                }
                className="w-full button"
              >
                Fix LaTeX Expressions
              </Button>
            </TabsContent>
            <TabsContent value="youtube">
              <CardHeader>
                <CardTitle>YouTube Link Converter</CardTitle>
                <CardDescription>
                  Converts a YouTube link to its embed version with optional
                  start and end times.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtube-link">YouTube Link</Label>
                  <Input
                    id="youtube-link"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="start-time">Start Time (mm:ss)</Label>
                    <Input
                      id="start-time"
                      placeholder="00:00"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="end-time">End Time (mm:ss)</Label>
                    <Input
                      id="end-time"
                      placeholder="00:00"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button onClick={convertYoutubeLink} className="w-full button">
                  Convert Link
                </Button>
                {embedLink && (
                  <div className="mt-4">
                    <Label htmlFor="embed-link">Embed Link</Label>
                    <Input
                      id="embed-link"
                      value={embedLink}
                      readOnly
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tutorial">
              <CardHeader>
                <CardTitle>Tutorial Creator</CardTitle>
                <CardDescription>
                  Create a tutorial entry by providing a topic name, YouTube
                  link, and title. The source type will be determined
                  automatically.
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tutorial-topic">Topic Name</Label>
                  <Input
                    id="tutorial-topic"
                    placeholder="Enter topic name"
                    value={tutorialTopic}
                    onChange={(e) => setTutorialTopic(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tutorial-youtube-link">YouTube Link</Label>
                  <Input
                    id="tutorial-youtube-link"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={tutorialYoutubeLink}
                    onChange={(e) => setTutorialYoutubeLink(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tutorial-title">Video Title</Label>
                  <Input
                    id="tutorial-title"
                    placeholder="Enter video title"
                    value={tutorialTitle}
                    onChange={(e) => setTutorialTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tutorial-json">Generated JSON</Label>
                  <div className="relative">
                    <Textarea
                      id="tutorial-json"
                      value={tutorialJson}
                      readOnly
                      className="mt-2 h-40 pr-10"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-4"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy to clipboard</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
