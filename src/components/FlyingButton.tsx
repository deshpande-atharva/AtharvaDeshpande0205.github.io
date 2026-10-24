import { useRef, useCallback, useState, useEffect } from "react";
import "./styles/FlyingButton.css";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "smoke" | "thrust";
}

interface FlyingButtonProps {
  children: React.ReactNode;
  altitude?: number;
  thrustColor?: string;
  smokeColor?: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  wrapperClassName?: string;
}

const FlyingButton = ({
  children,
  altitude = 120,
  thrustColor = "#8ec5ff",
  smokeColor = "#eef1f6",
  href,
  target,
  rel,
  className = "",
  wrapperClassName = "",
}: FlyingButtonProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const posRef = useRef({ y: 0, vy: 0 });
  const flyingRef = useRef(false);
  const [isFlying, setIsFlying] = useState(false);

  const spawnParticles = useCallback(
    (btnRect: DOMRect, canvasRect: DOMRect) => {
      const cx = btnRect.left - canvasRect.left + btnRect.width / 2;
      const bottom = btnRect.bottom - canvasRect.top;

      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * btnRect.width * 0.4,
          y: bottom,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 3 + 2,
          life: 1,
          maxLife: 1,
          size: Math.random() * 4 + 2,
          type: "thrust",
        });
      }

      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * btnRect.width * 0.6,
        y: bottom + Math.random() * 4,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 1.5 + 0.5,
        life: 1,
        maxLife: 1,
        size: Math.random() * 8 + 4,
        type: "smoke",
      });
    },
    []
  );

  const renderParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= p.type === "smoke" ? 1.01 : 0.97;

        ctx.globalAlpha = Math.max(0, p.life * (p.type === "smoke" ? 0.3 : 0.8));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.type === "thrust") {
          ctx.fillStyle = thrustColor;
          ctx.shadowColor = thrustColor;
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = smokeColor;
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    },
    [thrustColor, smokeColor]
  );

  const animate = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const btn = wrapper.querySelector(".flying-button__btn") as HTMLElement;
    if (!btn) return;

    const pos = posRef.current;
    const targetY = flyingRef.current ? -altitude : 0;

    const spring = 0.08;
    const damping = 0.82;
    pos.vy += (targetY - pos.y) * spring;
    pos.vy *= damping;
    pos.y += pos.vy;

    const wobble = flyingRef.current
      ? Math.sin(Date.now() * 0.003) * 2
      : 0;
    const tilt = pos.vy * 0.8;

    btn.style.transform = `translateY(${pos.y}px) rotate(${tilt}deg) translateX(${wobble}px)`;

    if (flyingRef.current || pos.y < -5) {
      const canvasRect = canvas.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      spawnParticles(btnRect, canvasRect);
    }

    renderParticles(ctx);

    if (
      !flyingRef.current &&
      Math.abs(pos.y) < 0.5 &&
      Math.abs(pos.vy) < 0.1
    ) {
      pos.y = 0;
      pos.vy = 0;
      btn.style.transform = "";
      setIsFlying(false);
      return;
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [altitude, spawnParticles, renderParticles]);

  const launchFly = useCallback(() => {
    flyingRef.current = true;
    setIsFlying(true);
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);

    // Come back down after 1.8s
    setTimeout(() => {
      flyingRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    }, 1800);
  }, [animate]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // Trigger download first
      if (href) {
        window.open(href, target || "_blank", rel ? undefined : "noreferrer");
      }

      // Then fly
      launchFly();
    },
    [href, target, rel, launchFly]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const resize = () => {
      const parent = wrapper.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth || 300;
      canvas.height = altitude + 200;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [altitude]);

  return (
    <div
      className={`flying-button ${wrapperClassName} ${isFlying ? "flying-button--active" : ""}`}
      ref={wrapperRef}
    >
      <canvas
        ref={canvasRef}
        className="flying-button__canvas"
        aria-hidden="true"
      />
      <a
        className={`flying-button__btn ${className}`}
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
      >
        {children}
      </a>
    </div>
  );
};

export default FlyingButton;
