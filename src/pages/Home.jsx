import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/mockApi';

const categories = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance'];

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function SkeletonGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-44 animate-pulse bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-3 p-5">
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
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() || post.title?.toLowerCase().includes(searchQuery.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="relative overflow-hidden pb-16">
      <section className="relative mx-auto max-w-4xl px-5 pb-9 pt-14 text-center sm:pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),rgba(236,72,153,0.06)_38%,rgba(255,255,255,0)_70%)] blur-2xl dark:opacity-40" />

        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-6 py-1.5 text-sm font-medium text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
          <span>New: AI feature integrated</span>
          <span className="text-xs">*</span>
        </div>

        <h1 className="mx-auto mt-10 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-700 dark:text-white sm:text-6xl">
          Your own <span className="text-indigo-600">blogging</span>
          <br />
          platform.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm font-medium leading-7 text-black dark:text-gray-300 sm:text-base">
          This is your space to think out loud, to share what matters, and try to write without filters.
          <br className="hidden sm:block" />
          Whatever it's one word or a thousand, your story starts right here.
        </p>

        <div className="mx-auto mt-9 flex max-w-xl overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900">
          <input
            type="search"
            placeholder="Search a blog"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none dark:text-white"
          />
          <button
            className="m-1 flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600 text-white transition hover:bg-indigo-500"
            aria-label="Search"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-5 sm:gap-9">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <section className="mx-auto max-w-screen-xl px-5">
        {loading ? (
          <SkeletonGrid />
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No matching posts found.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="flex overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex w-full flex-col">
                  <Link
                    to={`/blog/${post._id}`}
                    className="block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      src={
                        post.coverImage ||
                        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=70'
                      }
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {post.category || 'General'}
                      </span>
                      <span>{post.remote ? 'Public API' : post.author}</span>
                    </div>
                    <Link to={`/blog/${post._id}`}>
                      <h2 className="text-lg font-bold leading-snug text-gray-950 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                      {stripHtml(post.content)}
                    </p>
                    <Link
                      to={`/blog/${post._id}`}
                      className="mt-5 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
