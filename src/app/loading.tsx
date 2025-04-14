"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  const rotatingLoaderRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const rotatingLoader = rotatingLoaderRef.current;
    if (rotatingLoader) {
      animate(rotatingLoader, {
        rotate: [0, 360],
        duration: 2000,
        easing: "linear",
        loop: true,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/80 min-h-[100px]">
      <CircularProgress
        ref={rotatingLoaderRef}
        className="text-white"
        size={80}
        thickness={5}
        style={{ color: "#fff" }}
      />
      <p className="mt-4 text-white text-lg font-medium">Loading...</p>
    </div>
  );
};
export default Loading;
