import AnnouncementBar from "@/components/client/AnnouncementBar";
import ClientFooter from "@/components/client/ClientFooter";
import ClientHeader from "@/components/client/ClientHeader";
import {
  getClientSiteSettings,
  getClientVisibleCategories,
} from "@/lib/client/queries";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getClientSiteSettings(),
    getClientVisibleCategories(),
  ]);

  const isDarkMode = settings.themeMode === "DARK";

  return (
    <div
      className={
        isDarkMode
          ? "min-h-screen bg-neutral-950 text-white"
          : "min-h-screen bg-white text-gray-950"
      }
      style={
        {
          "--client-primary": settings.primaryColor,
          "--client-secondary": settings.secondaryColor,
        } as React.CSSProperties
      }
    >
      <AnnouncementBar secondaryColor={settings.secondaryColor} />

      <ClientHeader settings={settings} categories={categories} />

      <main>{children}</main>

      <ClientFooter settings={settings} categories={categories} />
    </div>
  );
}