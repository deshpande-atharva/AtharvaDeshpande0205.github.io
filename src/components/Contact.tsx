import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import OrbitImages from "./OrbitImages";

const base = import.meta.env.BASE_URL;

const socialLinks = [
  {
    src: `${base}images/github-white.svg`,
    alt: "GitHub",
    href: "https://github.com/deshpande-atharva",
  },
  {
    src: `${base}images/linkedin.svg`,
    alt: "LinkedIn",
    href: "https://www.linkedin.com/in/atharva-deshpande0205",
  },
  {
    src: `${base}images/outlook.svg`,
    alt: "Email",
    href: "mailto:deshpande.atha@northeastern.edu",
  },
  {
    src: `${base}images/instagram.svg`,
    alt: "Instagram",
    href: "https://www.instagram.com/iamatharvadeshpande",
  },
];

const Contact = () => {
  const handleClick = (index: number) => {
    const link = socialLinks[index];
    if (link) {
      window.open(link.href, "_blank");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Get In Touch</h3>
        <div className="contact-orbit">
          <OrbitImages
            images={socialLinks.map((s) => s.src)}
            shape="ellipse"
            radiusX={340}
            radiusY={80}
            rotation={-8}
            duration={30}
            itemSize={90}
            depth={0.6}
            showPath
            centerContent={
              <div className="contact-center">
                <h2>Let's Connect</h2>
                <p>deshpande.atha@northeastern.edu</p>
              </div>
            }
            radius={160}
            itemRadius={14}
            shadow={0.3}
            hoverScale={1.08}
            hoverSpeed={0.3}
            pathDash={0}
            direction="normal"
            easing="linear"
            fill
            alignToPath={false}
            draggable
            clickToFront
            paused={false}
            intro
            onItemClick={handleClick}
          />
        </div>
        <div className="contact-footer">
          <h2>
            Designed and Developed <br /> by <span>Atharva Deshpande</span>
          </h2>
          <h5>
            <MdCopyright /> 2026
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Contact;
