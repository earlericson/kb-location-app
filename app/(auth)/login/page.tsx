import { LoginForm } from "@/features/auth/login-form";

export const metadata = {
  title: "Login | Admin Portal",
  description: "Secure login for business management",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] px-4">
      {/* The background styling here adds a subtle "dot grid" pattern 
          to make the login screen look more professional.
      */}
      <LoginForm />
    </main>
  );
}