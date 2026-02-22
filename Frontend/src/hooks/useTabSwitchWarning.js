import { useEffect } from "react";

export const useTabSwitchWarning = () => {
  useEffect(() => {
    const onBlur = () => {
      alert("Tab switching detected. Test may be submitted.");
    };

    window.addEventListener("blur", onBlur);

    return () => window.removeEventListener("blur", onBlur);
  }, []);
};