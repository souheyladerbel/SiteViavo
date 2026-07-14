"use client";

import Link from "next/link";

type OrdersFiltersProps = {
  filters: {
    q: string;
    status: string;
    customer: string;
    dateFrom: string;
    dateTo: string;
  };
};

export default function OrdersFilters({ filters }: OrdersFiltersProps) {
  return (
    <form
      method="GET"
      className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-6"
    >
      <div>
        <label htmlFor="q" className="form-label">
          Recherche
        </label>

        <input
          id="q"
          name="q"
          defaultValue={filters.q}
          placeholder="N° commande, nom, email"
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="customer" className="form-label">
          Client
        </label>

        <input
          id="customer"
          name="customer"
          defaultValue={filters.customer}
          placeholder="Nom, email, téléphone"
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="status" className="form-label">
          Statut
        </label>

        <select
          id="status"
          name="status"
          defaultValue={filters.status}
          className="form-select"
        >
          <option value="">Tous</option>
          <option value="NEW">Nouvelle commande</option>
          <option value="CONFIRMED">Confirmée</option>
          <option value="PREPARING">En préparation</option>
          <option value="DELIVERED">Livrée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      </div>

      <div>
        <label htmlFor="dateFrom" className="form-label">
          Date début
        </label>

        <input
          id="dateFrom"
          name="dateFrom"
          type="date"
          defaultValue={filters.dateFrom}
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="dateTo" className="form-label">
          Date fin
        </label>

        <input
          id="dateTo"
          name="dateTo"
          type="date"
          defaultValue={filters.dateTo}
          className="form-control"
        />
      </div>

      <div className="flex items-end gap-3">
        <button
          type="submit"
          className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Filtrer
        </button>

        <Link
          href="/orders"
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}