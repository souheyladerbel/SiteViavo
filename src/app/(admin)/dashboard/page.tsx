import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { formatPrice } from "@/lib/products/utils";
import DashboardCharts from "./components/DashboardCharts";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 5;

const ORDER_STATUSES = [
  { value: "NEW", label: "Nouvelle commande" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PREPARING", label: "En préparation" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

type TopItem = {
  label: string;
  totalQuantity: number;
  totalRevenueInMillimes: number;
};

function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-TN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("fr-TN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatOrderStatus(status: string): string {
  return ORDER_STATUSES.find((item) => item.value === status)?.label ?? status;
}

function getOrderStatusClass(status: string): string {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700";
    case "CONFIRMED":
      return "bg-green-100 text-green-700";
    case "PREPARING":
      return "bg-amber-100 text-amber-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatChange(current: number, previous: number): string {
  if (previous === 0 && current === 0) {
    return "Stable";
  }

  if (previous === 0) {
    return "+100%";
  }

  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";

  return `${sign}${change.toFixed(1)}%`;
}

function buildDailyMetrics(
  orders: {
    createdAt: Date;
    totalInCents: number;
    status: string;
  }[],
  startDate: Date,
  days: number
) {
  const map = new Map<
    string,
    {
      date: string;
      label: string;
      orders: number;
      revenue: number;
    }
  >();

  for (let index = 0; index < days; index++) {
    const date = addDays(startDate, index);
    const key = getDateKey(date);

    map.set(key, {
      date: key,
      label: formatDayLabel(date),
      orders: 0,
      revenue: 0,
    });
  }

  for (const order of orders) {
    const key = getDateKey(order.createdAt);
    const item = map.get(key);

    if (!item) {
      continue;
    }

    item.orders += 1;

    if (order.status !== "CANCELLED") {
      item.revenue += order.totalInCents;
    }
  }

  return Array.from(map.values());
}

function buildTopItems(
  orderItems: {
    productNameSnapshot: string;
    categoryNameSnapshot: string | null;
    quantity: number;
    subtotal: number;
  }[],
  key: "product" | "category"
): TopItem[] {
  const map = new Map<string, TopItem>();

  for (const item of orderItems) {
    const label =
      key === "product"
        ? item.productNameSnapshot
        : item.categoryNameSnapshot || "Sans catégorie";

    const existing = map.get(label);

    if (existing) {
      existing.totalQuantity += item.quantity;
      existing.totalRevenueInMillimes += item.subtotal;
    } else {
      map.set(label, {
        label,
        totalQuantity: item.quantity,
        totalRevenueInMillimes: item.subtotal,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);
}

function StatCard({
  label,
  value,
  description,
  href,
}: {
  label: string;
  value: string | number;
  description?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>

      {description ? (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function InsightCard({
  title,
  message,
  tone = "blue",
}: {
  title: string;
  message: string;
  tone?: "blue" | "amber" | "green" | "red";
}) {
  const classes = {
    blue: "border-blue-100 bg-blue-50 text-blue-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    green: "border-green-100 bg-green-50 text-green-800",
    red: "border-red-100 bg-red-50 text-red-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${classes[tone]}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}

export default async function DashboardPage() {
  await requireSuperAdmin();

  const now = new Date();

  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const chartStartDate = addDays(todayStart, -29);

  const [
    totalOrders,
    todayOrders,
    yesterdayOrders,
    totalRevenue,
    monthlyRevenue,
    previousMonthlyRevenue,
    activeProducts,
    hiddenProducts,
    activePromoCodeCandidates,
    ordersLast30Days,
    orderStatusGroups,
    orderItemsForStats,
    lowStockProducts,
    latestOrders,
    latestActions,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),

    prisma.order.count({
      where: {
        createdAt: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    }),

    prisma.order.aggregate({
      where: {
        status: {
          not: "CANCELLED",
        },
      },
      _sum: {
        totalInCents: true,
      },
    }),

    prisma.order.aggregate({
      where: {
        status: {
          not: "CANCELLED",
        },
        createdAt: {
          gte: currentMonthStart,
        },
      },
      _sum: {
        totalInCents: true,
      },
    }),

    prisma.order.aggregate({
      where: {
        status: {
          not: "CANCELLED",
        },
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
      _sum: {
        totalInCents: true,
      },
    }),

    prisma.product.count({
      where: {
        isArchived: false,
        isVisible: true,
      },
    }),

    prisma.product.count({
      where: {
        isArchived: false,
        isVisible: false,
      },
    }),

    prisma.promoCode.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: now,
            },
          },
        ],
      },
      select: {
        usageLimit: true,
        usedCount: true,
      },
    }),

    prisma.order.findMany({
      where: {
        createdAt: {
          gte: chartStartDate,
        },
      },
      select: {
        createdAt: true,
        totalInCents: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),

    prisma.order.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.orderItem.findMany({
      where: {
        order: {
          status: {
            not: "CANCELLED",
          },
        },
      },
      select: {
        productNameSnapshot: true,
        categoryNameSnapshot: true,
        quantity: true,
        subtotal: true,
      },
    }),

    prisma.product.findMany({
      where: {
        isArchived: false,
        stock: {
          lte: LOW_STOCK_THRESHOLD,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 8,
      select: {
        id: true,
        name: true,
        stock: true,
        mainImageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    }),

    prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        action: true,
        entity: true,
        description: true,
        adminNameSnapshot: true,
        adminEmailSnapshot: true,
        createdAt: true,
      },
    }),
  ]);

  const activePromoCodes = activePromoCodeCandidates.filter((promoCode) => {
    if (promoCode.usageLimit === null) {
      return true;
    }

    return promoCode.usedCount < promoCode.usageLimit;
  }).length;

  const totalRevenueValue = totalRevenue._sum.totalInCents ?? 0;
  const monthlyRevenueValue = monthlyRevenue._sum.totalInCents ?? 0;
  const previousMonthlyRevenueValue =
    previousMonthlyRevenue._sum.totalInCents ?? 0;

  const dailyMetrics = buildDailyMetrics(ordersLast30Days, chartStartDate, 30);

  const statusMetrics = ORDER_STATUSES.map((status) => {
    const group = orderStatusGroups.find((item) => item.status === status.value);

    return {
      status: status.value,
      label: status.label,
      value: group?._count._all ?? 0,
    };
  });

  const topProducts = buildTopItems(orderItemsForStats, "product");
  const topCategories = buildTopItems(orderItemsForStats, "category");

  const mainInsight =
    todayOrders > yesterdayOrders
      ? "Les commandes du jour sont en progression par rapport à hier."
      : todayOrders < yesterdayOrders
        ? "Les commandes du jour sont en baisse par rapport à hier."
        : "Le volume de commandes est stable par rapport à hier.";

  const stockInsight =
    lowStockProducts.length > 0
      ? `${lowStockProducts.length} produit(s) nécessitent une attention stock.`
      : "Aucune alerte de stock faible pour le moment.";

  return (
    <section>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h2>

          <p className="mt-2 text-gray-600">
            Vue intelligente des commandes, ventes, produits, promotions et
            alertes.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          Dernière mise à jour : {formatDateTime(now)}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <InsightCard
          title="Résumé commandes"
          message={mainInsight}
          tone={
            todayOrders > yesterdayOrders
              ? "green"
              : todayOrders < yesterdayOrders
                ? "amber"
                : "blue"
          }
        />

        <InsightCard
          title="Stock"
          message={stockInsight}
          tone={lowStockProducts.length > 0 ? "red" : "green"}
        />

        <InsightCard
          title="Performance mensuelle"
          message={`Évolution CA du mois : ${formatChange(
            monthlyRevenueValue,
            previousMonthlyRevenueValue
          )} par rapport au mois précédent.`}
          tone={monthlyRevenueValue >= previousMonthlyRevenueValue ? "green" : "amber"}
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Commandes totales"
          value={totalOrders}
          description="Toutes les commandes enregistrées"
          href="/orders"
        />

        <StatCard
          label="Commandes du jour"
          value={todayOrders}
          description={`${formatChange(todayOrders, yesterdayOrders)} vs hier`}
          href="/orders"
        />

        <StatCard
          label="Chiffre d’affaires total"
          value={formatPrice(totalRevenueValue)}
          description="Hors commandes annulées"
          href="/orders"
        />

        <StatCard
          label="Chiffre d’affaires du mois"
          value={formatPrice(monthlyRevenueValue)}
          description={`${formatChange(
            monthlyRevenueValue,
            previousMonthlyRevenueValue
          )} vs mois précédent`}
          href="/orders"
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <StatCard
          label="Produits actifs"
          value={activeProducts}
          description="Produits visibles et non archivés"
          href="/products"
        />

        <StatCard
          label="Produits masqués"
          value={hiddenProducts}
          description="Produits non visibles côté client"
          href="/products"
        />

        <StatCard
          label="Codes promo actifs"
          value={activePromoCodes}
          description="Actifs, valides et non limités"
          href="/promo-codes"
        />
      </div>

      <div className="mt-8">
        <DashboardCharts
          dailyMetrics={dailyMetrics}
          statusMetrics={statusMetrics}
          topProducts={topProducts}
          topCategories={topCategories}
        />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Alertes de stock faible
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Produits avec stock inférieur ou égal à {LOW_STOCK_THRESHOLD}.
              </p>
            </div>

            <Link
              href="/products"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Produits
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucun produit en stock faible.
              </p>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="text-gray-500">
                  <tr>
                    <th className="py-3 font-medium">Produit</th>
                    <th className="py-3 font-medium">Catégorie</th>
                    <th className="py-3 font-medium">Stock</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {product.mainImageUrl ? (
                            <img
                              src={product.mainImageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-gray-100" />
                          )}

                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 text-gray-700">
                        {product.category.name}
                      </td>

                      <td className="py-3">
                        {product.stock === 0 ? (
                          <span className="font-bold text-red-600">
                            Rupture
                          </span>
                        ) : (
                          <span className="font-medium text-amber-700">
                            {product.stock}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Dernières commandes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Les commandes les plus récentes.
              </p>
            </div>

            <Link
              href="/orders"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Commandes
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {latestOrders.length === 0 ? (
              <p className="text-sm text-gray-500">
                Aucune commande enregistrée.
              </p>
            ) : (
              <table className="w-full border-collapse text-left text-sm">
                <thead className="text-gray-500">
                  <tr>
                    <th className="py-3 font-medium">Commande</th>
                    <th className="py-3 font-medium">Client</th>
                    <th className="py-3 font-medium">Total</th>
                    <th className="py-3 font-medium">Statut</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {latestOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3">
                        <p className="font-bold text-gray-900">
                          {order.orderNumber}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </td>

                      <td className="py-3">
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order._count.items} produit(s)
                        </p>
                      </td>

                      <td className="py-3 font-medium text-gray-900">
                        {formatPrice(order.totalInCents)}
                      </td>

                      <td className="py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusClass(
                            order.status
                          )}`}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Dernières actions admin
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Historique récent des actions effectuées dans l’espace admin.
            </p>
          </div>

          <Link
            href="/audit-logs"
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Historique
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          {latestActions.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune action admin enregistrée pour le moment.
            </p>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="py-3 font-medium">Action</th>
                  <th className="py-3 font-medium">Objet</th>
                  <th className="py-3 font-medium">Admin</th>
                  <th className="py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {latestActions.map((action) => (
                  <tr key={action.id}>
                    <td className="py-3">
                      <p className="font-medium text-gray-900">
                        {action.action}
                      </p>

                      {action.description ? (
                        <p className="mt-1 text-xs text-gray-500">
                          {action.description}
                        </p>
                      ) : null}
                    </td>

                    <td className="py-3 text-gray-700">
                      {action.entity || "-"}
                    </td>

                    <td className="py-3">
                      <p className="font-medium text-gray-900">
                        {action.adminNameSnapshot || "Admin inconnu"}
                      </p>

                      {action.adminEmailSnapshot ? (
                        <p className="text-xs text-gray-500">
                          {action.adminEmailSnapshot}
                        </p>
                      ) : null}
                    </td>

                    <td className="py-3 text-gray-700">
                      {formatDateTime(action.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}