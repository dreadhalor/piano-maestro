import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const VerticalSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation="vertical" // Set the orientation to vertical
    className={cn(
      "relative flex h-full w-4 touch-none select-none items-center", // Adjust the width and height for vertical orientation
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-primary/20 relative h-full w-1.5 grow overflow-hidden rounded-full">
      {" "}
      {/* Adjust the width and height for vertical orientation */}
      <SliderPrimitive.Range className="bg-primary absolute w-full" />{" "}
      {/* Adjust the width and position for vertical orientation */}
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
VerticalSlider.displayName = SliderPrimitive.Root.displayName;

export { VerticalSlider };
