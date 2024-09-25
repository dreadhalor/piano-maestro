import React, { useRef, useState, useLayoutEffect, useCallback } from "react";

interface ResponsiveScaleProps {
  children: React.ReactNode;
  desiredWidth: number; // The width in pixels at which the component should be at 100% scale
  className?: string; // Optional additional classes
}

export const ResponsiveScalingDiv: React.FC<ResponsiveScaleProps> = ({
  children,
  desiredWidth,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const newScale = containerWidth / desiredWidth;
    setScale(newScale < 1 ? newScale : 1); // Prevent scaling up beyond 100%
  }, [desiredWidth, setScale]);

  useLayoutEffect(() => {
    // Initial calculation
    handleResize();

    // For some reason, the initial calculation is off by a few pixels
    setTimeout(() => {
      handleResize();
    }, 0);

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div
      ref={containerRef}
      className={`flex w-full items-center justify-center ${className || ""}`}
    >
      <div
        className="min-w-0"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
};
