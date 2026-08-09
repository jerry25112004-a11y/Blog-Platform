export default function Newsletter() {
  return (
    <section className="bg-ink">
      <div className="container-page grid items-center gap-6 py-16 md:grid-cols-2">
        <div>
          <span className="eyebrow !text-gold-light">Weekly digest</span>
          <h2 className="mt-3 font-display text-2xl font-medium text-paper sm:text-3xl">
            The best of Inkwell, once a week.
          </h2>
          <p className="mt-2 max-w-sm text-sm text-paper/70">
            No spam — just the stories our editors approved and readers loved.
          </p>
        </div>
        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row md:ml-auto" action="#" method="post">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-gold-light">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
