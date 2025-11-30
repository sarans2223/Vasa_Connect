import { OnsiteAuthForm } from "@/components/onsite-auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Onsite Login | VaSa',
  description: "Onsite member login for VaSa.",
};

export default function OnsiteLoginPage() {
  return <OnsiteAuthForm />;
}
