import React, { useEffect, useState } from 'react';

// Define the type for your tutorials
interface Tutorial {
  topic: string;
  title: string;
  url: string;
  sourceType: string;
}

// Helper function to extract YouTube video ID and start/end times from the URL
const extractVideoDetails = (url: string): { videoId: string | null; start: string | null; end: string | null } => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/ // Regex to extract video ID
  );

  const startMatch = url.match(/[?&]start=(\d+)/);
  const endMatch = url.match(/[?&]end=(\d+)/);

  return {
    videoId: match ? match[1] : null,
    start: startMatch ? startMatch[1] : null,
    end: endMatch ? endMatch[1] : null,
  };
};

const GoodTutorials: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the goodTutorials.json file
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/goodTutorials.json');
        const data: Tutorial[] = await response.json();
        setTutorials(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutorials:', error);
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  return (
    <div>
      <h1>Good Tutorials</h1>
      {loading ? (
        <p>Loading tutorials...</p>
      ) : (
        <ul>
          {tutorials.map((tutorial, index) => {
            const { videoId, start, end } = extractVideoDetails(tutorial.url);

            return (
              <li key={index} style={{ marginBottom: '20px' }}>
                <h2>{tutorial.title} ({tutorial.topic})</h2>
                {videoId ? (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}${start ? `?start=${start}` : ''}${end ? `&end=${end}` : ''}`}
                    title={tutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p>Invalid YouTube URL or not embeddable: {tutorial.url}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GoodTutorials;
