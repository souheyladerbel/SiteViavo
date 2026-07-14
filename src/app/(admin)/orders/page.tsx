import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import type { OrderListItem } from "@/types/order";
import OrdersClient from "./OrdersClient";

type OrdersPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    customer?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  await requireSuperAdmin();

  const params = await searchParams;

  const q = params?.q?.trim() ?? "";
  const status = params?.status ?? "";
  const customer = params?.customer?.trim() ?? "";
  const dateFrom = params?.dateFrom ?? "";
  const dateTo = params?.dateTo ?? "";

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { orderNumber: { contains: q } },
                { customerName: { contains: q } },
                { customerEmail: { contains: q } },
                { customerPhone: { contains: q } },
              ],
            }
          : {},
        customer
          ? {
              OR: [
                { customerName: { contains: customer } },
                { customerEmail: { contains: customer } },
                { customerPhone: { contains: customer } },
              ],
            }
          : {},
        status ? { status } : {},
        dateFrom
          ? {
              createdAt: {
                gte: new Date(`${dateFrom}T00:00:00`),
              },
            }
          : {},
        dateTo
          ? {
              createdAt: {
                lte: new Date(`${dateTo}T23:59:59`),
              },
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  const formattedOrders: OrderListItem[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    status: order.status,
    totalInCents: order.totalInCents,
    itemsCount: order._count.items,
    createdAt: order.createdAt.toISOString(),
  }));

  return (
    <OrdersClient
      orders={formattedOrders}
      filters={{
        q,
        status,
        customer,
        dateFrom,
        dateTo,
      }}
    />
  );
}