export type AdminNavigationItem = {
  label: string;
  href: string;
  superAdminOnly?: boolean;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    superAdminOnly: true,
  },
  {
    label: "Admins",
    href: "/admins",
    superAdminOnly: true,
  },
  {
    label: "Catégories",
    href: "/categories",
  },
  {
    label: "Produits",
    href: "/products",
  },
  {
    label: "Codes promo",
    href: "/promo-codes",
  },
  {
    label: "Commandes",
    href: "/orders",
  },
  {
    label: "Paramètres",
    href: "/settings",
  },
  {
    label: "Historique",
    href: "/audit-logs",
    superAdminOnly: true,
  },
  {
    label: "Changer mon mot de passe",
    href: "/change-password",
  },
  
];