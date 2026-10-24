import "./styles/Career.css";

const Career = () => {

  return (
    <div
      className="career-section section-container"
      id="education"
    >
      <div className="career-container">

        {/* ================= WORK EXPERIENCE ================= */}

        <h2>
          Work <span>&</span>
          <br /> experience
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Mudstack */}

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Engineering Intern</h4>
                <h5>Mudstack Inc · USA</h5>
              </div>

              <h3>2026</h3>
            </div>

            <p>
              Built and shipped a production{" "}
              <strong>plugin distribution platform</strong> spanning{" "}
              <strong>
                React, TypeScript, Node.js, Electron, PostgreSQL, and AWS S3
              </strong>
              . Designed multi-tenant APIs, account-scoped authorization,
              versioned artifact workflows, desktop synchronization, and
              isolated plugin execution. Solved production reliability issues
              around cross-account isolation and large artifact transfers,
              backed by <strong>638 automated tests</strong>.
            </p>
          </div>

          {/* Persistent Systems */}

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer</h4>
                <h5>Persistent Systems · IBM Client</h5>
              </div>

              <h3>2022–23</h3>
            </div>

            <p>
              Worked on enterprise software and cloud systems for IBM across{" "}
              <strong>
                Go, C/C++, AWS, Terraform, Packer, and GitHub Actions
              </strong>
              . Built cloud provisioning APIs, worked with large production
              systems, automated infrastructure and deployments, and helped
              reduce release cycles from <strong>2 days to 6 hours</strong>{" "}
              through repeatable CI/CD workflows.
            </p>
          </div>
        </div>

        {/* ================= ACADEMIC PROJECTS ================= */}

        <h2 className="projects-title">
          Education 
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* VoiceCanvas */}

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Master of Science</h4>
                <h5>Northeastern University</h5>
              </div>

              <h3>2026</h3>
            </div>

            <p>
              Graduate study focused on designing, building, and testing production-grade software, with an emphasis on full-stack development, scalable system design, and applied AI.
              I apply this work in projects like JobSignal, a multi-agent pipeline that combines deterministic logic with LLMs for reliable, low-cost automation.
            </p>
          </div>

          {/* AWS Infrastructure Project */}

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Bachelor of Engineering</h4>
                <h5>
                  University of Pune
                </h5>
              </div>

              <h3>2022</h3>
            </div>

            <p>
              Built a strong foundation in computer engineering through hands-on work in data structures and algorithms, object-oriented programming, operating systems, database systems, computer networks, and software engineering.
              Developed and debugged applications in Java and C/C++, worked with relational databases and REST-based systems, and applied core concepts in memory management, concurrency, networking, and system design through academic projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;