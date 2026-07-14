import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Connexion Admin
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Connectez-vous pour accéder à l’interface d’administration.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
