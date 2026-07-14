"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettingView } from "@/types/settings";
import {
  updateSiteSettingsAction,
  type SettingsActionState,
} from "@/lib/settings/actions";

type SiteSettingsFormProps = {
  settings: SiteSettingView;
};

const initialState: SettingsActionState = {};

export default function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();

  const [values, setValues] = useState({
    themeMode: settings.themeMode as "LIGHT" | "DARK",
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    homeHeroTitle: settings.homeHeroTitle,
    homeHeroSubtitle: settings.homeHeroSubtitle,
    homeCtaText: settings.homeCtaText,
    homeCtaHref: settings.homeCtaHref,
  });

  const [state, formAction, isPending] = useActionState(
    updateSiteSettingsAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold text-gray-900">
        Affichage général
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Ces paramètres seront appliqués à la vitrine client.
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

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="logo" className="form-label">
            Logo du site
          </label>

          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo actuel"
              className="mb-3 h-16 w-16 rounded-xl object-contain border border-gray-200"
            />
          ) : null}

          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="form-control"
          />

          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG ou WEBP. Taille maximale : 1 Mo.
          </p>
        </div>

        <div>
          <label htmlFor="themeMode" className="form-label">
            Mode d’affichage
          </label>

          <select
            id="themeMode"
            name="themeMode"
            value={values.themeMode}
            onChange={(event) =>
              setValues({
                ...values,
                themeMode: event.target.value as "LIGHT" | "DARK",
              })
            }
            className="form-select"
          >
            <option value="LIGHT">Clair</option>
            <option value="DARK">Sombre</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="primaryColor" className="form-label">
              Couleur principale
            </label>

            <input
              id="primaryColor"
              name="primaryColor"
              type="color"
              value={values.primaryColor}
              onChange={(event) =>
                setValues({ ...values, primaryColor: event.target.value })
              }
              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-2"
            />

            {state.fieldErrors?.primaryColor ? (
              <p className="form-error">
                {state.fieldErrors.primaryColor[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="secondaryColor" className="form-label">
              Couleur secondaire
            </label>

            <input
              id="secondaryColor"
              name="secondaryColor"
              type="color"
              value={values.secondaryColor}
              onChange={(event) =>
                setValues({ ...values, secondaryColor: event.target.value })
              }
              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-2"
            />

            {state.fieldErrors?.secondaryColor ? (
              <p className="form-error">
                {state.fieldErrors.secondaryColor[0]}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="homeHeroTitle" className="form-label">
            Titre principal de l’accueil
          </label>

          <input
            id="homeHeroTitle"
            name="homeHeroTitle"
            value={values.homeHeroTitle}
            onChange={(event) =>
              setValues({ ...values, homeHeroTitle: event.target.value })
            }
            className="form-control"
          />

          {state.fieldErrors?.homeHeroTitle ? (
            <p className="form-error">
              {state.fieldErrors.homeHeroTitle[0]}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="homeHeroSubtitle" className="form-label">
            Sous-titre de l’accueil
          </label>

          <textarea
            id="homeHeroSubtitle"
            name="homeHeroSubtitle"
            rows={3}
            value={values.homeHeroSubtitle}
            onChange={(event) =>
              setValues({ ...values, homeHeroSubtitle: event.target.value })
            }
            className="form-control"
          />

          {state.fieldErrors?.homeHeroSubtitle ? (
            <p className="form-error">
              {state.fieldErrors.homeHeroSubtitle[0]}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="homeCtaText" className="form-label">
              Texte du bouton
            </label>

            <input
              id="homeCtaText"
              name="homeCtaText"
              value={values.homeCtaText}
              onChange={(event) =>
                setValues({ ...values, homeCtaText: event.target.value })
              }
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="homeCtaHref" className="form-label">
              Lien du bouton
            </label>

            <input
              id="homeCtaHref"
              name="homeCtaHref"
              value={values.homeCtaHref}
              onChange={(event) =>
                setValues({ ...values, homeCtaHref: event.target.value })
              }
              className="form-control"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </button>
      </div>
    </form>
  );
}