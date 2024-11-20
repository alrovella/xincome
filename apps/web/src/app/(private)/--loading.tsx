"use client";

import { useState, useEffect } from "react";

function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 100);
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex justify-center items-center pt-40">
      <div
        className="bg-gray-200 rounded-full w-64 h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="sr-only">Cargando, {progress}% completado</span>
    </div>
  );
}

export default Loading;
