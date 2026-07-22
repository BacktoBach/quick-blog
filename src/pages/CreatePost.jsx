import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/content/default/content.css";
import { createPost } from "../services/postService";
import {
  isCloudinaryConfigured,
  uploadCoverImage,
} from "../services/cloudinaryService";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    tags: "",
    content: "<p>Start writing your story...</p>",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cloudinaryReady = isCloudinaryConfigured();
  const navigate = useNavigate();

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    setCoverFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const coverImage = await uploadCoverImage(coverFile);
      const post = await createPost({ ...formData, coverImage });
      setCoverFile(null);
      navigate(`/blog/${post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-950 dark:text-white">
          Create new post
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          TinyMCE is self-hosted locally. Cover images upload to Cloudinary when
          the unsigned preset is configured.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </span>
          <input
            value={formData.title}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, title: event.target.value }))
            }
            required
            className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800"
            placeholder="Post title"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </span>
            <select
              value={formData.category}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800"
            >
              {["Technology", "Startup", "Lifestyle", "Finance"].map(
                (category) => (
                  <option key={category}>{category}</option>
                ),
              )}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </span>
            <input
              value={formData.tags}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, tags: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800"
              placeholder="react, frontend"
            />
          </label>
        </div>

        <label className="block">
          <span className="flex items-center justify-between gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover image
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                cloudinaryReady
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {cloudinaryReady
                ? "Cloudinary upload enabled"
                : "Local preview mode"}
            </span>
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-semibold file:text-white"
          />
          {!cloudinaryReady && (
            <span className="mt-2 block text-xs text-gray-500">
              Add Cloudinary env values before publishing posts with cover
              images.
            </span>
          )}
        </label>

        {preview && (
          <img
            src={preview}
            alt="Cover preview"
            className="aspect-[21/8] w-full rounded-lg object-cover"
          />
        )}

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <Editor
            value={formData.content}
            onEditorChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            init={{
              height: 360,
              menubar: false,
              license_key: "gpl",
              promotion: false,
              branding: false,
              skin: false,
              content_css: false,
              plugins: "lists link image table code wordcount",
              toolbar:
                "undo redo | blocks | bold italic underline | bullist numlist | link image table | code",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading
            ? cloudinaryReady
              ? "Uploading image..."
              : "Publishing..."
            : "Publish post"}
        </button>
      </form>
    </section>
  );
}
