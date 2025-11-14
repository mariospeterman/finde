'use client';

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Focus management for accessibility - focus main content first
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200/50 transition-all duration-300 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-200/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}

