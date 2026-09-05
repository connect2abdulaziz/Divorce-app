export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-serif text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-3 text-muted">{message ?? "Your sign-in link may have expired. Please try again."}</p>
    </main>
  );
}
