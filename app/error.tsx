"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow text-accent-dark">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
        That page hit a snag.
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
        Try again, or reach us directly on WhatsApp if it keeps happening.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button asChild variant="whatsapp">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </Button>
      </div>
      <Link href="/" className="mt-6 text-sm font-medium text-accent-dark hover:underline">
        Back to home
      </Link>
    </Container>
  );
}
