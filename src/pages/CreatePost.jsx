import { Editor } from "@tinymce/tinymce-react";
import { ImageUp, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";
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
import ConfirmDialog from "../components/ConfirmDialog";
import { useTheme } from "../context/ThemeContext";
import { createPost } from "../services/postService";
import { uploadCoverImage } from "../services/cloudinaryService";
import editorContentCss from "../styles/tinymce-content.css?url";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function appendTag(tags, value) {
  const tag = value.trim();
  if (!tag || tags.some((item) => item.toLowerCase() === tag.toLowerCase())) {
    return tags;
  }
  return [...tags, tag];
}

function hasMeaningfulContent(html) {
  const document = new DOMParser().parseFromString(html, "text/html");
  const text = document.body.textContent?.replace(/\u00a0/g, " ").trim();
  const hasMedia = document.body.querySelector("img, video, audio, iframe");

  return Boolean(text || hasMedia);
}

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const allowNavigationRef = useRef(false);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const isDirty = Boolean(
    coverFile ||
    formData.title.trim() ||
    formData.content.trim() ||
    formData.tags.length ||
    tagInput.trim(),
  );

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        !allowNavigationRef.current &&
        isDirty &&
        currentLocation.pathname !== nextLocation.pathname,
      [isDirty],
    ),
  );

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!isDirty || allowNavigationRef.current) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const clearFieldError = (field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setCoverFile(null);
      setPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setCoverFile(null);
      setPreview("");
      setFieldErrors((current) => ({
        ...current,
        image: "Please choose a valid image file.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setCoverFile(null);
      setPreview("");
      setFieldErrors((current) => ({
        ...current,
        image: "Image size must not exceed 5 MB.",
      }));
      event.target.value = "";
      return;
    }

    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
    clearFieldError("image");
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const editorBody = editorRef.current?.getBody();
    if (!editorBody) return;

    editorBody.classList.toggle("editor-dark", isDark);
    editorBody.classList.toggle("editor-light", !isDark);
  }, [isDark]);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;

    setFormData((current) => ({
      ...current,
      tags: appendTag(current.tags, tag),
    }));
    setTagInput("");
    clearFieldError("tags");
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((current) => ({
      ...current,
      tags: current.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const tags = appendTag(formData.tags, tagInput);
    const nextErrors = {};

    if (!coverFile) nextErrors.image = "Please choose a blog image.";
    if (!formData.title.trim()) nextErrors.title = "Blog title is required.";
    if (!hasMeaningfulContent(formData.content)) {
      nextErrors.content = "Blog content cannot be empty.";
    }
    if (!tags.length) nextErrors.tags = "Add at least one blog tag.";

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const coverImage = await uploadCoverImage(coverFile);
      const post = await createPost({ ...formData, tags, coverImage });
      allowNavigationRef.current = true;
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-center text-4xl font-bold tracking-tight text-indigo-600 sm:text-6xl">
        Create Blog
      </h1>

      {error && (
        <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-8 sm:mt-12">
        <div>
          <label
            htmlFor="blog-image"
            className="text-base font-semibold text-gray-950 dark:text-white"
          >
            Blog Image
          </label>
          <label
            htmlFor="blog-image"
            className="mt-3 flex min-h-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white transition hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500 sm:min-h-40"
          >
            {preview ? (
              <img
                src={preview}
                alt="Blog cover preview"
                className="max-h-72 w-full object-cover"
              />
            ) : (
              <span className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 sm:text-lg">
                <ImageUp className="h-6 w-6" />
                Click to upload image
              </span>
            )}
          </label>
          <input
            id="blog-image"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
          {fieldErrors.image && (
            <p
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.image}
            </p>
          )}
        </div>

        <label className="block">
          <span className="text-base font-semibold text-gray-950 dark:text-white">
            Blog Title
          </span>
          <input
            value={formData.title}
            onChange={(event) => {
              setFormData((current) => ({
                ...current,
                title: event.target.value,
              }));
              clearFieldError("title");
            }}
            aria-invalid={Boolean(fieldErrors.title)}
            className="mt-3 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-base"
            placeholder="Enter blog title"
          />
          {fieldErrors.title && (
            <span
              className="mt-2 block text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.title}
            </span>
          )}
        </label>

        <div>
          <p className="text-base font-semibold text-gray-950 dark:text-white">
            Blog Content
          </p>
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-300 bg-white [&_.tox-tinymce]:!h-[360px] dark:border-slate-700 sm:[&_.tox-tinymce]:!h-[460px]">
            <Editor
              value={formData.content}
              onInit={(_event, editor) => {
                editorRef.current = editor;
                const editorBody = editor.getBody();
                editorBody.classList.toggle("editor-dark", isDark);
                editorBody.classList.toggle("editor-light", !isDark);
              }}
              onEditorChange={(content) => {
                setFormData((current) => ({ ...current, content }));
                clearFieldError("content");
              }}
              init={{
                height: 460,
                menubar: "file edit view insert format tools table",
                license_key: "gpl",
                promotion: false,
                branding: false,
                skin: false,
                content_css: editorContentCss,
                body_class: isDark ? "editor-dark" : "editor-light",
                plugins: "lists link image table code wordcount",
                toolbar:
                  "undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image | code",
                toolbar_mode: "sliding",
              }}
            />
          </div>
          {fieldErrors.content && (
            <p
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.content}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="blog-tag"
            className="text-base font-semibold text-gray-950 dark:text-white"
          >
            Blog Tag
          </label>
          <div className="mt-3 flex items-stretch gap-2 sm:gap-3">
            <input
              id="blog-tag"
              value={tagInput}
              onChange={(event) => {
                setTagInput(event.target.value);
                clearFieldError("tags");
              }}
              onKeyDown={handleTagKeyDown}
              aria-invalid={Boolean(fieldErrors.tags)}
              className="min-h-12 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-base"
              placeholder="Enter blog tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="h-12 shrink-0 whitespace-nowrap rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-500 sm:px-6 sm:text-base"
            >
              Add Tag
            </button>
          </div>

          {fieldErrors.tags && (
            <p
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.tags}
            </p>
          )}

          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag} tag`}
                    className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        title="Discard changes?"
        message="Your blog has unsaved changes. If you leave now, the content you entered will be lost."
        confirmLabel="Leave page"
        onClose={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
      />
    </section>
  );
}
