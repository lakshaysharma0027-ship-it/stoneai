import type { BlogAuthor } from "@/lib/blog/types";

export function AuthorBox({ author }: { author: BlogAuthor }) {
  return (
    <aside className="blog-author-box">
      <div className="blog-author-avatar" aria-hidden>
        {author.name.charAt(0)}
      </div>
      <div>
        <p className="blog-author-name">{author.name}</p>
        <p className="blog-author-role">{author.role}</p>
        <p className="blog-author-bio">{author.bio}</p>
      </div>
    </aside>
  );
}
