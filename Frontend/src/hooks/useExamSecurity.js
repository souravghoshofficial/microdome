import { useEffect } from "react";

export const useExamSecurity = () => {
  useEffect(() => {
    if (import.meta.env.DEV) return;

    const prevent = (e) => e.preventDefault();

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("selectstart", prevent);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("selectstart", prevent);
    };
  }, []);
};