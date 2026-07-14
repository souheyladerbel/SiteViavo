import ChangePasswordForm from "./ChangePasswordForm";
import { requireCurrentAdmin } from "@/lib/auth/guards";

export default async function ChangePasswordPage() {
  const admin = await requireCurrentAdmin();

  return (
    <section>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Modifier mon mot de passe
        </h2>

        <p className="mt-2 text-gray-600">
          Vous êtes connecté en tant que{" "}
          <span className="font-medium text-gray-900">{admin.email}</span>.
        </p>
      </div>

      <div className="mt-8 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </section>
  );
}