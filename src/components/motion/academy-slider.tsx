"use client";
import { Children, useSyncExternalStore, type ReactNode } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselAutoplay, CarouselPagination } from "@/components/ui/carousel";

const MIN_LOOP_SLIDES = 10;
const subscribe = () => () => {};

export function AcademySlider({ label, children }: { label: string; children: ReactNode }) {
  const cards = Children.toArray(children);
  // A loop needs more slides than fit in view; repeat the cards, hidden from assistive tech and focus. Server HTML keeps one set.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const copies = hydrated && cards.length > 1 ? Math.ceil(MIN_LOOP_SLIDES / cards.length) : 1;
  return <Carousel aria-label={label} groupSize={cards.length}>
    <div className="academy-slider-controls"><span>تصفح البطاقات</span><CarouselAutoplay /><CarouselPrevious /><CarouselNext /></div>
    <CarouselContent role="group" aria-label={`بطاقات ${label}`}>
      {Array.from({ length: copies }, (_, copy) => cards.map((child, index) => {
        const duplicate = copy > 0;
        return <CarouselItem key={`${copy}-${index}`} index={copy * cards.length + index} {...(duplicate ? { "aria-hidden": true, inert: true } : { "aria-label": `بطاقة ${index + 1}` })}>{child}</CarouselItem>;
      }))}
    </CarouselContent>
    <CarouselPagination />
  </Carousel>;
}
