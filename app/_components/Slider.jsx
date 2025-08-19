"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import gsap from "gsap";

function Slider({ sliderList = [] }) {
  const imageRef = useRef(null);
  const [api, setApi] = useState(null);
  const [direction, setDirection] = useState("forward");


  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { x: -1000, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
      );
    }
  }, []);


  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      const current = api.selectedScrollSnap();
      const last = api.scrollSnapList().length - 1; 

      if (direction === "forward") {
        if (current === last) {
          setDirection("backward");
          api.scrollPrev();
        } else {
          api.scrollNext();
        }
      } else {
        if (current === 0) {
          setDirection("forward");
          api.scrollNext();
        } else {
          api.scrollPrev();
        }
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [api, direction]);

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {sliderList.map((slider, index) => (
            <CarouselItem key={index}>
              <Image
                ref={index === 0 ? imageRef : null}
                src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${slider.image[0].url}`}
                width={10000}
                height={400}
                alt=""
                className="rounded-2xl w-full h-[200px] md:h-[400px] object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden" />
        <CarouselNext className="hidden" />
      </Carousel>
    </div>
  );
}

export default Slider;
