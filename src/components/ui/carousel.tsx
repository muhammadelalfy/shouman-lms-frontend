"use client";
// Adapted from shadcn/ui Carousel, MIT. See THIRD-PARTY-NOTICES.md.
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { useReducedMotion } from "./use-reduced-motion";
import { useInView } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "./class-names";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselContextProps = {
  carouselRef: UseEmblaCarouselType[0];
  ready: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selected: number;
  snaps: number;
  groupSize: number;
  scrollTo: (index: number) => void;
  autoplay: boolean;
  toggleAutoplay: () => void;
  reduced: boolean;
};
const CarouselContext = React.createContext<CarouselContextProps | null>(null);
function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a Carousel");
  return context;
}

export function Carousel({ className, children, groupSize, ...props }: React.ComponentProps<"section"> & { groupSize?: number }) {
  const root = React.useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.25 });
  const [autoplay, setAutoplay] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState(0);
  const [carouselRef, api] = useEmblaCarousel({ direction: "rtl", align: "center", loop: true, containScroll: false, duration: 20 });
  const reduced = useReducedMotion();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelected(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList().length);
  }, []);
  const scrollPrev = React.useCallback(() => api?.scrollPrev(!!reduced), [api, reduced]);
  const scrollNext = React.useCallback(() => api?.scrollNext(!!reduced), [api, reduced]);
  const scrollTo = React.useCallback((index: number) => api?.scrollTo(index, reduced), [api, reduced]);
  // Disabling a boundary button can drop native focus without firing blur.
  // Reconcile after React commits the new disabled state.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setFocused(!!root.current?.contains(document.activeElement)));
    return () => cancelAnimationFrame(frame);
  }, [selected, snaps, reduced]);
  const shouldPlay = autoplay && !reduced && inView && !hovered && !focused && snaps > 1;
  React.useEffect(() => {
    if (!api || !shouldPlay) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (api.canScrollNext()) api.scrollNext(); else api.scrollTo(0);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [api, shouldPlay]);
  React.useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(() => onSelect(api));
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => { cancelAnimationFrame(frame); api.off("reInit", onSelect); api.off("select", onSelect); };
  }, [api, onSelect]);
  return <CarouselContext.Provider value={{ carouselRef, ready: !!api, scrollPrev, scrollNext, canScrollPrev, canScrollNext, selected, snaps, groupSize: groupSize || snaps, scrollTo, autoplay, toggleAutoplay: () => setAutoplay(value => !value), reduced }}>
    <section ref={root} data-autoplay-running={shouldPlay} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} className={cn("academy-slider", className)} dir="rtl" aria-roledescription="عارض بطاقات" data-component="21st-carousel" {...props} onKeyDown={event => {
      // Nested links/fields retain their native keys.
      if (event.target !== event.currentTarget && !(event.target as HTMLElement).hasAttribute("data-carousel-viewport")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        if (event.key === "ArrowLeft") scrollNext(); else scrollPrev();
      }
    }}>{children}</section>
  </CarouselContext.Provider>;
}
export function CarouselContent({ children, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, ready } = useCarousel();
  return <div ref={carouselRef} data-ready={ready} className="academy-carousel-viewport" data-carousel-viewport tabIndex={0} {...props}><div className="academy-carousel-content">{children}</div></div>;
}
export function CarouselItem({ className, index, ...props }: React.ComponentProps<"div"> & { index?: number }) {
  const { selected } = useCarousel();
  return <div role="group" aria-roledescription="بطاقة" data-active={index === undefined ? undefined : selected === index} className={cn("academy-carousel-item", className)} {...props} />;
}
export function CarouselPrevious() {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return <button type="button" aria-label="السابق" disabled={!canScrollPrev} onClick={scrollPrev}><ChevronRight size={20} aria-hidden="true" /></button>;
}
export function CarouselNext() {
  const { scrollNext, canScrollNext } = useCarousel();
  return <button type="button" aria-label="التالي" disabled={!canScrollNext} onClick={scrollNext}><ChevronLeft size={20} aria-hidden="true" /></button>;
}

export function CarouselAutoplay() {
  const { autoplay, toggleAutoplay, reduced, snaps } = useCarousel();
  return <button type="button" className="academy-autoplay" disabled={reduced || snaps < 2} onClick={toggleAutoplay} aria-label={reduced ? "العرض التلقائي متوقف وفق إعداد تقليل الحركة" : autoplay ? "إيقاف العرض التلقائي" : "تشغيل العرض التلقائي"}>
    {autoplay && !reduced ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
    {reduced ? "الحركة مخففة" : autoplay ? "إيقاف الحركة" : "تشغيل الحركة"}
  </button>;
}
export function CarouselPagination() {
  const { selected, groupSize, scrollTo } = useCarousel();
  return <div className="academy-carousel-pagination" role="group" aria-label="اختيار البطاقة">{Array.from({ length: groupSize }, (_, index) => <button key={index} type="button" aria-label={`الانتقال إلى البطاقة ${index + 1}`} aria-current={selected % groupSize === index ? "true" : undefined} onClick={() => scrollTo(index)}><span aria-hidden="true" /></button>)}</div>;
}
