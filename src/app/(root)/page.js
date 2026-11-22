import Link from "next/link";
import { defaultLocale } from "@/i18n";

export default function Page() {
  return <p><Link href={`/${defaultLocale}`}>FeminizidMap.org</Link></p>;
}
