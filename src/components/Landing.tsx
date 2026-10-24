import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import TechText from "./TechText";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              <span className="techtext-wrap">
                <span className="techtext-hidden">Atharva</span>
                <TechText
                  text="Atharva"
                  fontWeight={600}
                  autoSize
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  specks={12}
                  intro="type"
                  introDuration={1.5}
                  clickKick
                  guides={false}
                  letterSpacing={-0.02}
                  accentColor="#5eead4"
                  reach={180}
                  softness={0.7}
                  lineStyle="dashed"
                  strokeWidth={1.5}
                  speed={1}
                  bounce={0.4}
                  selection
                  labels={false}
                  color="currentColor"
                  align="left"
                  draggable
                  sweep
                />
              </span>
              <br />
              <span className="techtext-wrap">
                <span className="techtext-hidden">Deshpande</span>
                <TechText
                  text="Deshpande"
                  fontWeight={600}
                  autoSize
                  reveal="letter"
                  dashLength={4}
                  dashGap={2}
                  specks={12}
                  intro="type"
                  introDuration={1.5}
                  clickKick
                  guides={false}
                  letterSpacing={-0.02}
                  accentColor="#5eead4"
                  reach={180}
                  softness={0.7}
                  lineStyle="dashed"
                  strokeWidth={1.5}
                  speed={1}
                  bounce={0.4}
                  selection
                  labels={false}
                  color="currentColor"
                  align="left"
                  draggable
                  sweep
                />
              </span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Full Stack &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Cloud</div>
              <div className="landing-h2-2">Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Engineer</div>
              <div className="landing-h2-info-1">AI</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
