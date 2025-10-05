import { redirect } from "next/navigation"

export default function LoginPage() {
  // Redirect old login page to new auth flow
  redirect("/auth/login")
}
