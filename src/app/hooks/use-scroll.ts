import React from "react";

export const useScroll = (threshold: number = 0) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > threshold);
    function handleScroll() {
      setScrolled(window.scrollY > threshold);
    }
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { scrolled, mounted };
};
