import { PixelBars } from "@/components/pixel-bars";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PixelBars className="h-10 animate-pulse" />
    </div>
  );
}
