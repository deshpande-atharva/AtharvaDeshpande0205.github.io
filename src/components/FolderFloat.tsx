import { useState, useRef, useCallback } from "react";
import "./styles/FolderFloat.css";

interface FolderFloatProps {
  items: string[];
  label: string;
  sublabel?: string;
  folderColor?: string;
  frontColor?: string;
  paperColor?: string;
  itemTextColor?: string;
  labelColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  onSelect?: (value: string, index: number) => void;
}

const FolderFloat = ({
  items,
  label,
  sublabel,
  folderColor = "#3f3f46",
  frontColor = "#52525b",
  paperColor = "#f5f5f5",
  itemTextColor = "#18181b",
  labelColor = "#f5f5f5",
  width = 200,
  height = 148,
  radius = 14,
  onSelect,
}: FolderFloatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  }, []);

  const tabWidth = Math.min(width * 0.45, 90);
  const tabHeight = 20;

  return (
    <div
      className={`folder-float ${isOpen ? "folder-float--open" : ""}`}
      style={{ width, height: height + tabHeight }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Tab */}
      <div
        className="folder-float__tab"
        style={{
          width: tabWidth,
          height: tabHeight,
          backgroundColor: folderColor,
          borderRadius: `${radius * 0.6}px ${radius * 0.6}px 0 0`,
        }}
      />

      {/* Folder body */}
      <div
        className="folder-float__body"
        style={{
          width,
          height,
          backgroundColor: folderColor,
          borderRadius: `0 ${radius}px ${radius}px ${radius}px`,
        }}
      >
        {/* Paper notes */}
        <div className="folder-float__papers">
          {items.map((item, i) => (
            <div
              key={i}
              className="folder-float__paper"
              style={{
                backgroundColor: paperColor,
                color: itemTextColor,
                borderRadius: radius * 0.5,
                transitionDelay: isOpen ? `${i * 50}ms` : `${(items.length - i) * 30}ms`,
                zIndex: items.length - i,
              }}
              onClick={() => onSelect?.(item, i)}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Front flap */}
        <div
          className="folder-float__front"
          style={{
            backgroundColor: frontColor,
            borderRadius: `0 ${radius}px ${radius}px ${radius}px`,
          }}
        >
          <div className="folder-float__label" style={{ color: labelColor }}>
            <span className="folder-float__label-text">{label}</span>
            {sublabel && (
              <span className="folder-float__sublabel">{sublabel}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderFloat;
