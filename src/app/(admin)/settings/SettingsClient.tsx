"use client";

import type {
  BestSellerProductItem,
  CarouselImageItem,
  EligibleBestSellerProduct,
  SiteSettingView,
} from "@/types/settings";
import SiteSettingsForm from "./components/SiteSettingsForm";
import CarouselManager from "./components/CarouselManager";
import BestSellerManager from "./components/BestSellerManager";

type SettingsClientProps = {
  settings: SiteSettingView;
  carouselImages: CarouselImageItem[];
  bestSellerProducts: BestSellerProductItem[];
  eligibleProducts: EligibleBestSellerProduct[];
};

export default function SettingsClient({
  settings,
  carouselImages,
  bestSellerProducts,
  eligibleProducts,
}: SettingsClientProps) {
  return (
    <section>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Paramètres du site
        </h2>

        <p className="mt-2 text-gray-600">
          Gérer le logo, le carrousel, les textes d’accueil, les couleurs, le
          thème et les produits Best Seller.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">
        <SiteSettingsForm settings={settings} />

        <BestSellerManager
          bestSellerProducts={bestSellerProducts}
          eligibleProducts={eligibleProducts}
        />
      </div>

      <div className="mt-8">
        <CarouselManager carouselImages={carouselImages} />
      </div>
    </section>
  );
}   