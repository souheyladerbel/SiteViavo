"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CarouselImageItem } from "@/types/settings";
import {
  createCarouselImageAction,
  deleteCarouselImageAction,
  updateCarouselImageAction,
  type SettingsActionState,
} from "@/lib/settings/actions";

type CarouselManagerProps = {
  carouselImages: CarouselImageItem[];
};

const initialState: SettingsActionState = {};

export default function CarouselManager({
  carouselImages,
}: CarouselManagerProps) {
  const router = useRouter();

  const [createValues, setCreateValues] = useState({
    title: "",
    subtitle: "",
    altText: "",
    displayOrder: 0,
    isActive: true,
  });

  const [state, formAction, isPending] = useActionState(
    createCarouselImageAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      setCreateValues({
        title: "",
        subtitle: "",
        altText: "",
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [state.success, router]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">
        Images du carrousel
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Ajouter, modifier, supprimer ou réordonner les images du carrousel.
      </p>

      {state.success ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {state.success}
        </div>
      ) : null}

      {state.error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}

      <form
        action={formAction}
        className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5"
      >
        <h4 className="font-semibold text-gray-900">
          Ajouter une image
        </h4>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="image" className="form-label">
              Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="form-control"
            />

            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG ou WEBP. Taille maximale : 3 Mo.
            </p>
          </div>

          <div>
            <label htmlFor="displayOrder" className="form-label">
              Ordre
            </label>

            <input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min="0"
              value={createValues.displayOrder}
              onChange={(event) =>
                setCreateValues({
                  ...createValues,
                  displayOrder: Number(event.target.value),
                })
              }
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="title" className="form-label">
              Titre
            </label>

            <input
              id="title"
              name="title"
              value={createValues.title}
              onChange={(event) =>
                setCreateValues({ ...createValues, title: event.target.value })
              }
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="altText" className="form-label">
              Texte alternatif
            </label>

            <input
              id="altText"
              name="altText"
              value={createValues.altText}
              onChange={(event) =>
                setCreateValues({
                  ...createValues,
                  altText: event.target.value,
                })
              }
              className="form-control"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="subtitle" className="form-label">
              Sous-titre
            </label>

            <textarea
              id="subtitle"
              name="subtitle"
              rows={2}
              value={createValues.subtitle}
              onChange={(event) =>
                setCreateValues({
                  ...createValues,
                  subtitle: event.target.value,
                })
              }
              className="form-control"
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm font-medium text-gray-900">
          <input
            name="isActive"
            type="checkbox"
            checked={createValues.isActive}
            onChange={(event) =>
              setCreateValues({
                ...createValues,
                isActive: event.target.checked,
              })
            }
            className="form-checkbox"
          />
          Image active dans le carrousel
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isPending ? "Ajout..." : "Ajouter l’image"}
        </button>
      </form>

      <div className="mt-8 space-y-5">
        {carouselImages.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucune image dans le carrousel.
          </p>
        ) : (
          carouselImages.map((image) => (
            <div
              key={image.id}
              className="rounded-xl border border-gray-200 p-5"
            >
              <form action={updateCarouselImageAction}>
                <input type="hidden" name="id" value={image.id} />

                <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || image.title || "Image carrousel"}
                    className="h-32 w-full rounded-xl object-cover"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="form-label">Remplacer l’image</label>
                      <input
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="form-control"
                      />
                    </div>

                    <div>
                      <label className="form-label">Ordre</label>
                      <input
                        name="displayOrder"
                        type="number"
                        min="0"
                        defaultValue={image.displayOrder}
                        className="form-control"
                      />
                    </div>

                    <div>
                      <label className="form-label">Titre</label>
                      <input
                        name="title"
                        defaultValue={image.title ?? ""}
                        className="form-control"
                      />
                    </div>

                    <div>
                      <label className="form-label">Texte alternatif</label>
                      <input
                        name="altText"
                        defaultValue={image.altText ?? ""}
                        className="form-control"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="form-label">Sous-titre</label>
                      <textarea
                        name="subtitle"
                        rows={2}
                        defaultValue={image.subtitle ?? ""}
                        className="form-control"
                      />
                    </div>

                    <label className="flex items-center gap-3 text-sm font-medium text-gray-900">
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={image.isActive}
                        className="form-checkbox"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>

              <form
                action={deleteCarouselImageAction}
                onSubmit={(event) => {
                  if (!window.confirm("Supprimer cette image du carrousel ?")) {
                    event.preventDefault();
                  }
                }}
                className="mt-3 flex justify-end"
              >
                <input type="hidden" name="id" value={image.id} />

                <button
                  type="submit"
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}