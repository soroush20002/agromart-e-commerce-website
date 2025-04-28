import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

function Slider({ sliderList = [] }) {
  return (
    <div>
      <Carousel>
        <CarouselContent>
            {sliderList.map((slider,index)=>(
              <CarouselItem key={index}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${slider.image[0].url}`}
                    width={10000}
                    height={400}
                    alt="slider"
                    className="rounded-2xl w-full h-[200px] md:h-[400px] object-cover"
                  />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden"/>
        <CarouselNext className="hidden" />
      </Carousel>
    </div>
  );
}

export default Slider;
