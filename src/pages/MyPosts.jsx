import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePost, getVisiblePosts } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function MyPosts() {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      setPosts(await getVisiblePosts(user));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    getVisiblePosts(user)
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
  }, [user]);

  const handleDelete = async (post) => {
    const ok = window.confirm(`Delete "${post.title}"?`);
    if (!ok) return;

    try {
      await deletePost(post._id || post.id);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">
            {isAdmin ? 'All posts' : 'My posts'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Users see only their posts. Admin sees all posts.
          </p>
        </div>
        <Link to="/posts/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          New post
        </Link>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">{error}</div>}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading posts...</div>
      ) : (
        <PostTable posts={posts} onDelete={handleDelete} />
      )}
    </section>
  );
}

export function PostTable({ posts, onDelete }) {
  if (!posts.length) {
    return <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">No posts yet.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="max-w-sm px-5 py-4 font-semibold text-gray-950 dark:text-white">
                  <Link to={`/blog/${post._id}`} className="hover:text-indigo-600">
                    {post.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-gray-500">{post.author}</td>
                <td className="px-5 py-4 text-gray-500">{post.category}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onDelete(post)}
                    className="font-semibold text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

