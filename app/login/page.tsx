import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 p-8 shadow-[0_28px_70px_rgba(11,30,39,0.09)]">
        <p className="text-sm uppercase tracking-[0.28em] text-[#cb6b3d]">Member access</p>
        <h1 className="mt-4 font-serif text-4xl text-[#112f3d]">Login with email</h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Sign in to publish a new advertisement. If the email does not exist yet, Laravel creates the account during
          the first login.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
