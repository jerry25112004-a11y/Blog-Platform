import Image from "next/image";

type AuthorCardData = {
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  blogCount?: number;
};

export default function AuthorCard({ author }: { author: AuthorCardData }) {
  return (
    <div className="glass-card flex items-center gap-4 p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-forest/10">
        {author.avatarUrl ? (
          <Image src={author.avatarUrl} alt={author.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-lg text-forest-dark">
            {author.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <div className="font-display text-base font-medium text-ink">{author.name}</div>
        {author.bio && <p className="mt-0.5 line-clamp-2 text-xs text-ink2">{author.bio}</p>}
        {typeof author.blogCount === "number" && (
          <p className="mt-1 text-xs text-forest-dark">{author.blogCount} published</p>
        )}
      </div>
    </div>
  );
}
