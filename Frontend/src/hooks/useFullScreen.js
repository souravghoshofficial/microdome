import { useEffect } from "react";

export const useFullscreen = () => {
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch {}
    };

    enterFullscreen();

    const onExit = () => {
      if (!document.fullscreenElement) {
        alert("You exited fullscreen. Test will be submitted.");
      }
    };

    document.addEventListener("fullscreenchange", onExit);

    return () => {
      document.removeEventListener("fullscreenchange", onExit);
    };
  }, []);
};