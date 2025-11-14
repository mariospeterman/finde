'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import gsap from "gsap";

type EasingPreset = "linear" | "elastic";

export type CardSwapProps = {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: EasingPreset;
  className?: string;
  children: ReactNode;
};

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, className, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute left-1/2 top-1/2 rounded-3xl border border-blue-100/70 bg-white/95 p-4 sm:p-6 text-left shadow-lg shadow-blue-200/40 [backface-visibility:hidden] [transform-style:preserve-3d] overflow-hidden ${customClass ?? ""} ${className ?? ""}`.trim()}
  />
));

Card.displayName = "Card";

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

const makeSlot = (index: number, distX: number, distY: number, total: number, isMobile: boolean = false): Slot => {
  // Reduce card distance on mobile to prevent overflow
  const adjustedDistX = isMobile ? distX * 0.7 : distX;
  const adjustedDistY = isMobile ? distY * 0.7 : distY;
  return {
    x: index * adjustedDistX,
    y: -index * adjustedDistY,
    z: -index * adjustedDistX * 1.35,
  zIndex: total - index,
  };
};

const placeImmediately = (element: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const easingConfig = (preset: EasingPreset) =>
  preset === "elastic"
    ? {
        ease: "elastic.out(0.6, 0.9)",
        durDrop: 1.6,
        durMove: 1.6,
        durReturn: 1.6,
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
    : {
        ease: "power1.inOut",
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.18,
      };

export function CardSwap({
  width = 320,
  height = 360,
  cardDistance = 54,
  verticalDistance = 64,
  delay = 4500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 5,
  easing = "elastic",
  className = "",
  children,
}: CardSwapProps) {
  const config = easingConfig(easing);
  const childElements = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const cardElements = useRef<(HTMLDivElement | null)[]>([]);
  const order = useRef<number[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const pauseResumeRef = useRef<{ pause: () => void; resume: () => void; node: HTMLDivElement } | null>(null);
  const totalRef = useRef(childElements.length);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwappingRef = useRef(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const currentLength = childElements.length;
    totalRef.current = currentLength;
    cardElements.current = cardElements.current.slice(0, currentLength);
    if (order.current.length !== currentLength) {
      order.current = Array.from({ length: currentLength }, (_, index) => index);
    }
  }, [childElements.length]);

  useEffect(() => {
    if (!childElements.length) {
      return undefined;
    }

    let initializationAttempts = 0;
    const maxAttempts = 10;

    const initialize = () => {
      const elements = cardElements.current;
      const currentTotal = totalRef.current;
      const allElementsReady = elements.slice(0, currentTotal).every((el) => el !== null && el !== undefined);
      
      if (!allElementsReady) {
        initializationAttempts++;
        if (initializationAttempts < maxAttempts) {
          requestAnimationFrame(initialize);
        }
        return;
      }

      const readyElements = elements.slice(0, currentTotal) as HTMLDivElement[];
      readyElements.forEach((el, idx) => {
        const slot = makeSlot(idx, cardDistance, verticalDistance, currentTotal, isMobile);
        placeImmediately(el, slot, skewAmount);
      });

      const swap = (manual = true) => {
        if (isSwappingRef.current && !manual) return;
        
        const currentElements = cardElements.current;
        const currentTotal = totalRef.current;
        const currentReady = currentElements.slice(0, currentTotal) as HTMLDivElement[];
        
        if (order.current.length < 2 || currentReady.length < 2) return;

        isSwappingRef.current = true;
        const [front, ...rest] = order.current;
        const frontElement = currentReady[front];
        if (!frontElement) {
          isSwappingRef.current = false;
          return;
        }

      const tl = gsap.timeline({
        onComplete: () => {
          isSwappingRef.current = false;
        }
      });
      timelineRef.current = tl;

      // Adjust animation for mobile - faster and less dramatic
      const dropDistance = isMobile ? 300 : 420;
      const mobileDuration = isMobile ? 0.6 : config.durDrop;

      tl.to(frontElement, {
        y: `+=${dropDistance}`,
        duration: mobileDuration,
        ease: isMobile ? "power2.out" : config.ease,
      });

      tl.addLabel("promote", `-=${mobileDuration * config.promoteOverlap}`);

      rest.forEach((idx, offset) => {
        const el = currentReady[idx];
        if (!el) return;
        const slot = makeSlot(offset, cardDistance, verticalDistance, currentTotal, isMobile);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: isMobile ? 0.6 : config.durMove,
            ease: isMobile ? "power2.out" : config.ease,
          },
          `promote+=${offset * (isMobile ? 0.08 : 0.12)}`,
        );
      });

      const backSlot = makeSlot(currentTotal - 1, cardDistance, verticalDistance, currentTotal, isMobile);

      tl.addLabel("return", `promote+=${(isMobile ? 0.6 : config.durMove) * config.returnDelay}`);
      tl.call(() => {
        gsap.set(frontElement, { zIndex: backSlot.zIndex });
      }, undefined, "return");

      tl.to(
        frontElement,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: isMobile ? 0.6 : config.durReturn,
          ease: isMobile ? "power2.out" : config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

      // Don't auto-swap - only manual (click/swipe)
      // swap(); // Don't call swap on init - show first card

      if (pauseOnHover) {
        const node = containerRef.current;
        if (node) {
          const pause = () => {
            timelineRef.current?.pause();
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
            }
          };
          const resume = () => {
            timelineRef.current?.play();
            intervalRef.current = window.setInterval(swap, delay);
          };

          pauseResumeRef.current = { pause, resume, node };
          node.addEventListener("mouseenter", pause);
          node.addEventListener("mouseleave", resume);
        }
      }
    };

    requestAnimationFrame(initialize);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      const pauseResume = pauseResumeRef.current;
      if (pauseOnHover && pauseResume) {
        const { pause, resume, node } = pauseResume;
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        pauseResumeRef.current = null;
      }
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, childElements, config, isMobile]);

  // Manual swap function (works on all devices)
  const handleManualSwap = useCallback(() => {
    if (isSwappingRef.current) return;
    
    const currentElements = cardElements.current;
    const currentTotal = totalRef.current;
    const currentReady = currentElements.slice(0, currentTotal) as HTMLDivElement[];
    
    if (order.current.length < 2 || currentReady.length < 2) return;

    isSwappingRef.current = true;
    const [front, ...rest] = order.current;
    const frontElement = currentReady[front];
    if (!frontElement) {
      isSwappingRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isSwappingRef.current = false;
      }
    });
    timelineRef.current = tl;

    // Use same animation settings as main swap, but faster for better UX
    const dropDistance = isMobile ? 300 : 420;
    const animDuration = isMobile ? 0.6 : config.durDrop;

    tl.to(frontElement, {
      y: `+=${dropDistance}`,
      duration: animDuration,
      ease: isMobile ? "power2.out" : config.ease,
    });

    tl.addLabel("promote", `-=${animDuration * config.promoteOverlap}`);

    rest.forEach((idx, offset) => {
      const el = currentReady[idx];
      if (!el) return;
      const slot = makeSlot(offset, cardDistance, verticalDistance, currentTotal, isMobile);
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: isMobile ? 0.6 : config.durMove,
          ease: isMobile ? "power2.out" : config.ease,
        },
        `promote+=${offset * (isMobile ? 0.08 : 0.12)}`,
      );
    });

    const backSlot = makeSlot(currentTotal - 1, cardDistance, verticalDistance, currentTotal, isMobile);

    tl.addLabel("return", `promote+=${(isMobile ? 0.6 : config.durMove) * config.returnDelay}`);
    tl.call(() => {
      gsap.set(frontElement, { zIndex: backSlot.zIndex });
    }, undefined, "return");

    tl.to(
      frontElement,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: isMobile ? 0.6 : config.durReturn,
        ease: isMobile ? "power2.out" : config.ease,
      },
      "return",
    );

    tl.call(() => {
      order.current = [...rest, front];
    });
  }, [cardDistance, verticalDistance, isMobile, config]);

  // Touch handlers for swipe (works on all devices with touch)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't start swipe if touching a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button, a')) {
      return;
    }
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    // Don't trigger swipe if touching a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button, a')) {
      touchStartRef.current = null;
      return;
    }
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const minSwipeDistance = 30; // Reduced for easier triggering
    const maxSwipeTime = 400; // Increased for more forgiving timing

    // Check for horizontal swipe (left or right) - more lenient
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      e.preventDefault();
      handleManualSwap();
    }
    touchStartRef.current = null;
  }, [handleManualSwap]);

  const refCallbacks = useMemo(() => {
    return childElements.map((_, idx) => (el: HTMLDivElement | null) => {
      cardElements.current[idx] = el;
    });
  }, [childElements]);

  const renderedCards = useMemo(() => {
    return childElements.map((child, idx) => {
      if (!isValidElement<CardProps>(child)) {
        return child;
      }
      const propsWithRef = {
        ...child.props,
        key: idx,
        ref: refCallbacks[idx],
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
          // Don't trigger swap if clicking on interactive elements
          const target = event.target as HTMLElement;
          if (!target.closest('button, a, input, select, textarea')) {
            child.props.onClick?.(event);
            onCardClick?.(idx);
            // Trigger manual swap on card click
            if (!isSwappingRef.current) {
              event.stopPropagation();
              handleManualSwap();
            }
          } else {
            child.props.onClick?.(event);
            onCardClick?.(idx);
          }
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return cloneElement(child, propsWithRef as any);
    });
  }, [childElements, width, height, onCardClick, refCallbacks, isMobile, handleManualSwap]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // Clicking anywhere on the container or card swaps the front card (works on all devices)
    if (!isSwappingRef.current) {
      const target = e.target as HTMLElement;
      // Check if click is on a card or button/link within card (not just empty space)
      const card = target.closest('[class*="rounded"], [class*="Card"]');
      const isButtonOrLink = target.closest('button, a');
      
      // Don't swap if clicking directly on a button or link (let them handle their own click)
      if (card && !isButtonOrLink) {
        e.preventDefault();
        e.stopPropagation();
        handleManualSwap();
      }
    }
  }, [handleManualSwap]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto flex items-center justify-center [perspective:900px] overflow-visible ${className}`.trim()}
      style={{ width, height, minHeight: height }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
    >
      {renderedCards}
    </div>
  );
}


