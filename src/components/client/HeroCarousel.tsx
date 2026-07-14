"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  ClientCarouselImage,
  ClientSiteSettings,
} from "@/types/client";

type HeroCarouselProps = {
  settings: ClientSiteSettings;
  images: ClientCarouselImage[];
};

export default function HeroCarousel({
  settings,
  images,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [images.length]);

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#f8f4ef]">
      {activeImage ? (
        <img
          src={activeImage.imageUrl}
          alt={activeImage.altText || activeImage.title || "Image accueil"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#eadfd2] via-[#f8f4ef] to-white" />
      )}

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] items-center px-5 py-20 lg:px-10">
        <div className="max-w-2xl text-white">
          <p
            className="text-sm font-semibold uppercase tracking-[0.4em]"
            style={{
              color: settings.secondaryColor,
            }}
          >
            Nouvelle collection
          </p>

          <h1 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">
            {activeImage?.title || settings.homeHeroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
            {activeImage?.subtitle || settings.homeHeroSubtitle}
          </p>

          <Link
            href={settings.homeCtaHref}
            className="mt-8 inline-flex items-center justify-center bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
          >
            {settings.homeCtaText}
          </Link>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Afficher image ${index + 1}`}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}