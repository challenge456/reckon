import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Reckon",
  description: "Get in touch with the Reckon team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back home
        </Link>
        <h1 className="mb-4 mt-6 text-3xl font-semibold">Get in touch</h1>
        <p className="text-neutral-400">
          Questions, bug reports, or feedback — reach out anytime at{" "}
          <a
            href="mailto:support@reckon.app"
            className="text-white underline underline-offset-2"
          >
            support@reckon.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}