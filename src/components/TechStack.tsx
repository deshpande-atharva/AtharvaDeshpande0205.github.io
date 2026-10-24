import InfiniteSpiral from "./InfiniteSpiral";

const base = import.meta.env.BASE_URL;

const techImages = [
  { src: `${base}images/tech/golang.svg`, alt: "Go" },
  { src: `${base}images/tech/typescript.svg`, alt: "TypeScript" },
  { src: `${base}images/tech/javascript.svg`, alt: "JavaScript" },
  { src: `${base}images/tech/python.svg`, alt: "Python" },
  { src: `${base}images/tech/java.svg`, alt: "Java" },
  { src: `${base}images/tech/cpp.svg`, alt: "C++" },
  { src: `${base}images/tech/c.svg`, alt: "C" },
  { src: `${base}images/tech/sql.svg`, alt: "SQL" },
  { src: `${base}images/tech/bash.svg`, alt: "Bash" },
  { src: `${base}images/tech/react.svg`, alt: "React" },
  { src: `${base}images/tech/tanstack.svg`, alt: "TanStack Query" },
  { src: `${base}images/tech/html5.svg`, alt: "HTML5" },
  { src: `${base}images/tech/css3.svg`, alt: "CSS3" },
  { src: `${base}images/tech/tailwindcss.svg`, alt: "Tailwind CSS" },
  { src: `${base}images/tech/vite.svg`, alt: "Vite" },
  { src: `${base}images/tech/nodejs.svg`, alt: "Node.js" },
  { src: `${base}images/tech/express.svg`, alt: "Express.js" },
  { src: `${base}images/tech/fastapi.svg`, alt: "FastAPI" },
  { src: `${base}images/tech/springboot.svg`, alt: "Spring Boot" },
  { src: `${base}images/tech/trpc.svg`, alt: "tRPC" },
  { src: `${base}images/tech/postgresql.svg`, alt: "PostgreSQL" },
  { src: `${base}images/tech/mongodb.svg`, alt: "MongoDB" },
  { src: `${base}images/tech/aws.svg`, alt: "AWS" },
  { src: `${base}images/tech/docker.svg`, alt: "Docker" },
  { src: `${base}images/tech/kubernetes.svg`, alt: "Kubernetes" },
  { src: `${base}images/tech/terraform.svg`, alt: "Terraform" },
  { src: `${base}images/tech/packer.svg`, alt: "Packer" },
  { src: `${base}images/tech/githubactions.svg`, alt: "GitHub Actions" },
  { src: `${base}images/tech/git.svg`, alt: "Git" },
  { src: `${base}images/tech/github.svg`, alt: "GitHub" },
  { src: `${base}images/tech/claude.svg`, alt: "Claude" },
  { src: `${base}images/tech/gemini.svg`, alt: "Google Gemini" },
  { src: `${base}images/tech/openai.svg`, alt: "OpenAI" },
];

const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <h2>My Tech Stack</h2>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <InfiniteSpiral
          items={techImages}
          animationMode="auto"
          speed={0.55}
          radius={170}
          cardWidth={100}
          cardHeight={120}
          verticalSpacing={60}
          perspective={1000}
          cardRadius={10}
          centerScale={1.2}
          edgeBlur={6}
          cardsPerTurn={7}
          pauseOnHover={false}
          direction="up"
          rotation={0}
          cardTilt={0}
          edgeFade={0.3}
          imageFit="contain"
          grayscale={0}
        />
      </div>
    </div>
  );
};

export default TechStack;
