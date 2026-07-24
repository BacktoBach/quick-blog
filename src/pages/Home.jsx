import { useEffect, useMemo, useState } from "react";
import { ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=70";

function stripHtml(html = "") {
  const plainText = html.replace(/<[^>]*>/g, " ");
  const decodedText = new DOMParser().parseFromString(
    plainText,
    "text/html",
  ).body.textContent;

  return decodedText?.replace(/\s+/g, " ").trim() || "";
}

function SkeletonGrid() {
  return (
    <div className="mx-auto grid max-w-[18rem] gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:max-w-6xl xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="aspect-[16/9] animate-pulse bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    getPosts()
      .then((data) => {
        if (mounted) setPosts(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;

    return posts.filter((post) => post.title?.toLowerCase().includes(query));
  }, [posts, searchQuery]);

  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-9 sm:px-6 lg:pt-10">
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),rgba(236,72,153,0.06)_38%,rgba(255,255,255,0)_70%)] blur-2xl dark:opacity-40" />

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-700 dark:text-white sm:text-6xl">
          Your own <span className="text-indigo-600">blogging</span>
          <br />
          platform.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm font-light leading-7 text-black dark:text-gray-300 sm:text-base">
          This is your space to think out loud, to share what matters, and try
          to write without filters.

          Whatever it's one word or a thousand, your story starts right here.
        </p>

        <form
          className="mx-auto mt-7 flex max-w-[17.5rem] overflow-hidden rounded-md border border-gray-300 bg-white p-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900 sm:max-w-2xl"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="search"
            placeholder="Enter search title..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none dark:text-white sm:h-12 sm:px-4"
          />
          <button
            type="submit"
            className="h-9 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500 sm:h-12 sm:px-10 sm:text-base"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-9 sm:mt-12">
        {loading ? (
          <SkeletonGrid />
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No matching posts found.
          </div>
        ) : (
          <div className="mx-auto grid max-w-[18rem] gap-6 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:max-w-6xl xl:grid-cols-4">
            {filteredPosts.map((post) => {
              const imageUrl = post.coverImage || FALLBACK_IMAGE;

              return (
                <article
                  key={post.id}
                  className="flex overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex w-full flex-col">
                    <div className="group relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Link to={`/blog/${post.id}`} className="block h-full">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                      <a
                        href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Search image from ${post.title} with Google Lens`}
                        title="Search with Google Lens"
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 opacity-0 shadow-md transition hover:scale-105 group-hover:opacity-100 focus:opacity-100"
                      >
                        <ScanSearch size={21} aria-hidden="true" />
                      </a>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {post.category}
                        </span>
                        <span>{post.author}</span>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <h2 className="mb-3 text-lg font-bold leading-snug text-gray-950 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                        {stripHtml(post.content)}
                      </p>
                      <Link
                        to={`/blog/${post.id}`}
                        className="mt-5 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
