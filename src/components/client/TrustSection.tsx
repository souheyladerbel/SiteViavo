const trustItems = [
  {
    title: "Livraison en Tunisie",
    description: "Recevez vos bijoux rapidement partout en Tunisie.",
  },
  {
    title: "Qualité sélectionnée",
    description: "Des pièces choisies avec soin pour un style raffiné.",
  },
  {
    title: "Commande simple",
    description: "Une expérience fluide du panier jusqu’à la confirmation.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-[#faf7f2] px-5 py-16 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gray-500">
            Pourquoi nous choisir
          </p>

          <h2 className="mt-3 font-serif text-4xl text-gray-950 md:text-5xl">
            Une expérience pensée pour vous
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="border border-black/10 bg-white px-8 py-10 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                ✓
              </div>

              <h3 className="mt-6 font-serif text-2xl text-gray-950">
                {item.title}
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}