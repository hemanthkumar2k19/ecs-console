import MarketingPanel from "@/components/auth/MarketingPanel";
import LoginCard from "@/components/auth/LoginCard";

export const metadata = {
  title: "Sign In | ECS Console",
  description:
    "Sign in to ECS Console — the unified management platform for Evidence Collection Systems.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <MarketingPanel />
      <LoginCard />
    </main>
  );
}
