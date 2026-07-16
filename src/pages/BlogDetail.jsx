import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPost } from '../api/mockApi';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    return <div className="py-20 text-center text-gray-500">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-20 text-center">
        <p className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error || 'Post not found.'}
        </p>
        <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 py-8">
      <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
        Back home
      </Link>

      <header className="space-y-4">
        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {post.category || 'General'}
        </span>
        <h1 className="text-4xl font-extrabold leading-tight text-gray-950 dark:text-white">{post.title}</h1>
        <p className="text-sm text-gray-500">
          By {post.author || 'QuickBlog'} · {new Date(post.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </header>

      <img
        src={
          post.coverImage ||
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80'
        }
        alt={post.title}
        className="aspect-[21/10] w-full rounded-lg object-cover"
      />

      <div
        className="prose max-w-none text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: post.content || post.description || '' }}
      />
    </article>
  );
}
