import Image from "next/image";

export function PageHeroBackground({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) return null;

  return (
    <div className="absolute inset-0">
      <Image src={imageUrl} alt="" fill priority sizes="100vw" unoptimized className="object-cover" />
      <div className="absolute inset-0 bg-ink/60" />
    </div>
  );
}
