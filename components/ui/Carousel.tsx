"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap carousel. Slides are server-rendered children; this
 * component only adds the scroll container and previous/next controls.
 */
export function Carousel({
  children,
  label,
  previousLabel,
  nextLabel,
  className,
}: {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const controlClass =
    "grid size-11 place-items-center rounded-full bg-white text-ink shadow-xs ring-1 ring-line-strong transition-[opacity,background-color] hover:bg-surface disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white";

  return (
    <div className={className}>
      <div className="mb-2 hidden justify-end gap-2 sm:flex">
        <button type="button" onClick={() => scroll(-1)} disabled={edges.start} className={controlClass}>
          <ChevronLeft aria-hidden className="size-5" />
          <span className="sr-only">{previousLabel}</span>
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={edges.end} className={controlClass}>
          <ChevronRight aria-hidden className="size-5" />
          <span className="sr-only">{nextLabel}</span>
        </button>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "-mx-5 no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-5 pb-8",
          "sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-10 lg:scroll-px-10 lg:px-10",
          "focus-visible:outline-offset-[-2px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
