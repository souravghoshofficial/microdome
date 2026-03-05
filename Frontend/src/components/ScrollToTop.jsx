import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 0);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location]);

  return null;
};

export default ScrollToTop;