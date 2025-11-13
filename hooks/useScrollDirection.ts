"use client";

import { useEffect, useState, useRef, RefObject } from "react";

/**
 * Hook to detect scroll direction
 * @returns {Object} { isScrollingDown, scrollY, lastScrollY }
 */
export const useScrollDirection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    isScrollingDown,
    scrollY,
    lastScrollY: lastScrollYRef.current,
  };
};

/**
 * Hook to detect if element is in viewport with scroll direction
 * @param {RefObject} ref - React ref to the element
 * @param {number} threshold - Percentage of element visible (0-1)
 * @returns {boolean} - True if element is in viewport and scrolling down
 */
export const useScrollIntoView = (
  ref: RefObject<HTMLElement>,
  threshold = 0.1
) => {
  const [isInView, setIsInView] = useState(false);
  const { isScrollingDown } = useScrollDirection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isScrollingDown) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, isScrollingDown]);

  return isInView;
};

/**
 * Hook combining scroll detection with Intersection Observer
 * Triggers animation only when scrolling down and element enters viewport
 */
export const useScrollAnimationTrigger = (
  ref: RefObject<HTMLElement>,
  options = { threshold: 0.1, rootMargin: "-100px 0px 0px 0px" }
) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const { isScrollingDown } = useScrollDirection();

  useEffect(() => {
    if (hasTriggered) return; // Only trigger once

    const observer = new IntersectionObserver(([entry]) => {
      // Only trigger animation if scrolling down AND element in view
      if (entry.isIntersecting && isScrollingDown) {
        setHasTriggered(true);
        observer.unobserve(entry.target);
      }
    }, options as IntersectionObserverInit);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options, hasTriggered, isScrollingDown]);

  return hasTriggered;
};
