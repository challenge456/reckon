import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <p className="text-sm text-neutral-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold">
        This page missed its own deadline.
      </h1>
      <p className="mt-2 text-neutral-400">
        Whatever you&apos;re looking for isn&apos;t here.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-900"
      >
        Back to home
      </Link>
    </div>
  );
}