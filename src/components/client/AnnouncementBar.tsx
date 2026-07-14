type AnnouncementBarProps = {
  secondaryColor: string;
};

export default function AnnouncementBar({
  secondaryColor,
}: AnnouncementBarProps) {
  return (
    <div
      className="flex h-10 items-center justify-center px-4 text-center text-xs font-medium tracking-wide text-white sm:text-sm"
      style={{
        backgroundColor: secondaryColor,
      }}
    >
      Nouvelle collection disponible — Livraison gratuite à partir de 150 TND
    </div>
  );
}