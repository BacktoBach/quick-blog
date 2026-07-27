import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import { deletePost, getVisiblePosts } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { htmlToPlainText } from "../utils/html";

export default function MyPosts() {
  const { isAdmin, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState("");
  const { showToast } = useToast();

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

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      setDeletingPostId(postToDelete.id);
      setError("");
      await deletePost(postToDelete.id);
      await loadPosts();
      setPostToDelete(null);
      showToast("Post deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingPostId("");
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8 sm:py-12">
      <div className="relative flex flex-col items-center gap-4 text-center sm:min-h-11 sm:justify-center">
        <div>
          <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold text-gray-950 dark:text-white">
            <span aria-hidden="true" className="text-4xl leading-none">
              ✍️
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {isAdmin ? "All Posts" : "My Posts"}
            </span>
          </h1>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading posts...</div>
      ) : error ? null : (
        <PostTable posts={posts} onDelete={setPostToDelete} />
      )}

      <ConfirmDialog
        open={Boolean(postToDelete)}
        title="Delete post?"
        message={`"${postToDelete?.title || ""}" will be permanently deleted.`}
        loading={deletingPostId === postToDelete?.id}
        onClose={() => !deletingPostId && setPostToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export function PostTable({ posts, onDelete }) {
  if (!posts.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-[680px] w-full table-fixed text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800">
          <tr>
            <th className="w-[30%] px-5 py-3">Title</th>
            <th className="w-[52%] px-5 py-3">Content</th>
            <th className="px-5 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-5 py-4 font-semibold text-gray-950 dark:text-white">
                <p className="truncate">{post.title}</p>
              </td>
              <td className="px-5 py-4 text-gray-500">
                <p className="truncate">{htmlToPlainText(post.content)}</p>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    to={`/posts/${post.id}`}
                    aria-label={`View ${post.title}`}
                    title="View post"
                    className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-600"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(post)}
                    aria-label={`Delete ${post.title}`}
                    title="Delete post"
                    className="grid h-10 w-10 place-items-center rounded-lg bg-red-500 text-white transition hover:bg-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
