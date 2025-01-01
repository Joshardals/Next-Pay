import { LoginForm } from "@/app/_components/Form/LoginForm";

export default function LoginPage() {
  return (
    <main className="w-full flex flex-col items-center min-h-screen px-4 text-[#E4E4E4]">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-medium text-center">Sign in</h1>

        <LoginForm />
      </div>
    </main>
  );
}
