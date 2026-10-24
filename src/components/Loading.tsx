import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import SplitFlapText from "./SplitFlapText";

const Loading = () => {
  const { setIsLoading } = useLoading();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      import("./utils/initialFX").then((module) => {
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${fadeOut ? "loading-fade-out" : ""}`}>
      <div className="loading-split-flap">
        <SplitFlapText
          words={[
            "WELCOME",
            "स्वागत है",
            "欢迎光临",
            "أهلاً وسهلاً",
          ]}
          flipDuration={0.1}
          stagger={0.04}
          cycleDelay={800}
          charset="ABCDEFGHIJKLMNOPQRSTUVWXYZस्वागतहै欢迎光临أهلاًوسهلاً "
          flipsPerChar={6}
          order="left"
          align="center"
          tileStyle="board"
          tileColor="#111827"
          textColor="#f8fafc"
          glare={0}
          depth={0.5}
          tileRadius={8}
          gap={6}
          fontSize={52}
          loop
          padTo={12}
          intro
        />
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
