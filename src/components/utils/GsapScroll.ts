import gsap from "gsap";

export function setLanyardTimeline() {
  if (window.innerWidth > 1024) {
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "center 55%",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl1
      .fromTo(
        ".character-model",
        { x: 0, xPercent: -50 },
        { x: "-25%", xPercent: -50, duration: 1 },
        0
      )
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

    tl2
      .to(".about-section", { y: "30%", duration: 6 }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
        0
      )
      .fromTo(
        ".what-box-in",
        { display: "none" },
        { display: "flex", duration: 0.1, delay: 6 },
        0
      )
      .fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
        0.3
      );

    tl3
      .fromTo(
        ".character-model",
        { y: "0%" },
        { y: "-100%", duration: 4, ease: "none", delay: 1 },
        0
      )
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0);
  } else {
    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
  }
}

export function setAllTimeline() {
  const careerGroups = gsap.utils.toArray<HTMLElement>(".career-info");

  careerGroups.forEach((group) => {
    const timeline = group.querySelector(".career-timeline");
    const dot = group.querySelector(".career-dot");
    const boxes = group.querySelectorAll(".career-info-box");

    if (timeline) {
      gsap.fromTo(
        timeline,
        { maxHeight: "0%", opacity: 0 },
        {
          maxHeight: "100%",
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    if (dot) {
      gsap.fromTo(
        dot,
        { animationIterationCount: "infinite" },
        {
          animationIterationCount: "1",
          delay: 1.2,
          duration: 0.1,
          scrollTrigger: {
            trigger: group,
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    gsap.fromTo(
      boxes,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: group,
          start: "top 75%",
          once: true,
        },
      }
    );
  });
}
