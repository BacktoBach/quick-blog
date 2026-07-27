import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { getPost } from "../services/postService";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getPost(id)
      .then((data) => {
        if (mounted) setPost(data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading post...</div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-20 text-center">
        <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error || "Post not found."}
        </p>
        <Link
          to="/"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Back home
        </Link>
      </div>
    );
  }

  const safeContent = DOMPurify.sanitize(post.content || "", {
    USE_PROFILES: { html: true },
  });

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
      <header className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Published on{" "}
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-gray-950 dark:text-white">
          {post.title}
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {post.author}
        </p>
      </header>

      <img
        src={post.coverImage}
        alt={post.title}
        className="aspect-[21/10] w-full rounded-lg object-cover"
      />

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{
          __html: safeContent,
        }}
      />
    </article>
  );
}
