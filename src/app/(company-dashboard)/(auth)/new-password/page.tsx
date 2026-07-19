import { checkTemporaryPassword } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import NewPasswordPage from "@/components/new-password/new-password";

export default async function Page() {
  const result = await checkTemporaryPassword();
  
  if (result.error) redirect("/login");
  if (!result.hasTemporaryPassword) redirect("/dashboard");

  return <NewPasswordPage />;
}