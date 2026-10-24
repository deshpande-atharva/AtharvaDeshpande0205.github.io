import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import GooeyNav from "./GooeyNav";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const sections = [
  { label: "HOME", selector: ".landing-section" },
  { label: "ABOUT", selector: ".about-section" },
  { label: "WHAT I DO", selector: ".whatIDO" },
  { label: "EXPERIENCE", selector: ".career-section" },
  { label: "WORK", selector: ".work-section" },
  { label: "TECH STACK", selector: ".techstack" },
  { label: "CONTACT", selector: ".contact-section" },
];

const navItems = sections.map((s) => ({ label: s.label, href: s.selector }));

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const smootherReady = useRef(false);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);
    smootherReady.current = true;

    // Track active section based on scroll — delay to avoid false triggers on init
    setTimeout(() => {
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section.selector,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(index);
          },
        });
      });
    }, 3000);

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);

  const handleNavChange = (_index: number, item: { label: string; href?: string }) => {
    if (!item.href) return;
    const el = document.querySelector(item.href);
    if (!el) return;

    if (window.innerWidth > 1024 && smootherReady.current && smoother) {
      smoother.scrollTo(el, true);
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AD
        </a>
        <div className="navbar-gooey">
          <GooeyNav
            items={navItems}
            activeIndex={activeIndex}
            initialActiveIndex={0}
            theme="dark"
            size="md"
            frame
            particleCount={15}
            spread={56}
            animationTime={600}
            timeVariance={300}
            gooeyness={0.5}
            wobble={0.5}
            hoverEffect
            onChange={handleNavChange}
          />
        </div>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
