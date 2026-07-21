import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { PixelBars } from "@/components/pixel-bars";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <PixelBars className="mb-6" />
      <p className="eyebrow text-accent-bright">404</p>
      <h1 className="mt-3 text-3xl font-light text-off-white sm:text-4xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-off-white/60">
        It may have moved, or the link might be off. Head back home, or get in
        touch and we&apos;ll point you the right way.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" className="border-white/15 text-off-white hover:border-accent-bright hover:text-accent-bright">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </Container>
  );
}
