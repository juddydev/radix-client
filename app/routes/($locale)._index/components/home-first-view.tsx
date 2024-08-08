import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"

export function HomeFirstView() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>
          <div className="z-auto bg-neutral-200">
            <div className="flex h-96 w-full flex-col items-center justify-center gap-y-4">
              <h1 className="whitespace-pre text-center text-5xl leading-tight lg:text-6xl lg:leading-tight">
                {"UNINOVERSE\nOPEN"}
              </h1>
              <p className="text-xl">{"2024.6.22"}</p>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="z-auto bg-neutral-300">
            <div className="flex h-96 w-full flex-col items-center justify-center gap-y-4">
              <h1 className="whitespace-pre text-center text-3xl leading-tight lg:text-6xl lg:leading-tight">
                {"カスタマイズ  &  アバター"}
              </h1>
              <p className="text-3xl">{"Coming Soon"}</p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-4 border-none" />
      <CarouselNext className="right-4 border-none" />
    </Carousel>
  )
}
