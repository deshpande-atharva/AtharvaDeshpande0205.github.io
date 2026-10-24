import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { setLanyardTimeline, setAllTimeline } from "./utils/GsapScroll";
import { useLoading } from "../context/LoadingProvider";

const TechStack = lazy(() => import("./TechStack"));

const LanyardWrapper = ({ children }: PropsWithChildren) => (
  <div className="character-container">
    <div className="character-model">
      <div className="lanyard-inner">
        {children}
      </div>
    </div>
  </div>
);

const MainContainer = ({ children }: PropsWithChildren) => {
  const { setLoading } = useLoading();
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  useEffect(() => {
    // Simulate loading progress since Lanyard doesn't have a model load phase
    let percent = 0;
    const interval = setInterval(() => {
      percent += Math.round(Math.random() * 15) + 5;
      if (percent >= 100) {
        percent = 100;
        clearInterval(interval);
      }
      setLoading(percent);
    }, 100);

    // Delay timeline setup to ensure ScrollSmoother is ready
    const timer = setTimeout(() => {
      setLanyardTimeline();
      setAllTimeline();
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && <LanyardWrapper>{children}</LanyardWrapper>}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && <LanyardWrapper>{children}</LanyardWrapper>}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
