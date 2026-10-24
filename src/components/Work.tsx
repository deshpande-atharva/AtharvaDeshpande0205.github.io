import "./styles/Work.css";
import FolderFloat from "./FolderFloat";


const projects = [
  {
    title: "VoiceCanvas",
    category: "Real-Time AI Speech Analysis Platform",
    tools:
      "React, FastAPI, Deepgram, Claude, WebSockets, Web Audio API, Docker",
    link: "https://github.com/deshpande-atharva/Sentiment-Transcript-Visualizer",
  },
  {
    title: "CloudForge",
    category: "Multi-Account AWS Infrastructure & Immutable Delivery Platform",
    tools:
      "AWS, Terraform, Packer, GitHub Actions, EC2, RDS, ALB, Auto Scaling, KMS",
    link: "https://github.com/deshpande-atharva/cloud-infra-and-webapp",
  },
  {
    title: "DocuExtract AI",
    category: "AI-Powered PDF Data Extraction Platform",
    tools:
      "React, TypeScript, FastAPI, Google Gemini, PyPDF2, Docker, Docker Compose",
    link: "https://github.com/deshpande-atharva/AI-powered-PDF-extractor-and-Summarizer",
  },
  {
    title: "PharmaLens AI",
    category: "LLM-Powered SEC Drug Pipeline Intelligence Platform",
    tools:
      "Python, FastAPI, OpenAI, Gemini, SEC EDGAR, Google Cloud Storage, Streamlit",
    link: "https://github.com/deshpande-atharva/clinic-bot-extraction",
  },
  {
    title: "WeatherFlow",
    category: "Real-Time JavaFX Weather Application",
    tools: "Java 17, JavaFX, OpenWeatherMap API, REST APIs, FXML, CSS",
    link: "https://github.com/deshpande-atharva/OOD_Project",
  },
  {
    title: "StreamFlix",
    category: "Full-Stack MERN Streaming Platform",
    tools:
      "React, Node.js, Express.js, MongoDB, JWT, Tailwind CSS, TMDB API",
    link: "https://github.com/deshpande-atharva/Netflic-Clone",
  },
  {
    title: "Canvas Replica",
    category: "Responsive Full-Stack Learning Platform",
    tools:
      "React, JavaScript, Node.js, MongoDB, HTML5, CSS3, Responsive Design",
    link: "https://github.com/deshpande-atharva/WebDesignProject",
  },
  {
    title: "JobPilot",
    category: "Automated Job Discovery & Application Intelligence Pipeline",
    tools:
      "Python, LangGraph, Pydantic, Gemini, Greenhouse, Ashby, Workday, GitHub Actions, OpenPyXL",
    link: "https://github.com/deshpande-atharva/JobSearcher",
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="work-folders">
          {projects.map((project, index) => (
            <FolderFloat
              key={index}
              items={[
                project.category,
                `Tools: ${project.tools}`,
                "View on GitHub →",
              ]}
              label={project.title}
              sublabel={project.category}
              folderColor="#3f3f46"
              frontColor="#52525b"
              paperColor="#f5f5f5"
              itemTextColor="#18181b"
              labelColor="#f5f5f5"
              width={240}
              height={160}
              radius={14}
              onSelect={(value) => {
                if (value === "View on GitHub →") {
                  window.open(project.link, "_blank");
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
