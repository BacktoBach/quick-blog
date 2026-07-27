export function htmlToPlainText(html = "") {
  const htmlWithSpacing = html.replace(/<[^>]*>/g, " ");
  const document = new DOMParser().parseFromString(
    htmlWithSpacing,
    "text/html",
  );
  return document.body.textContent?.replace(/\s+/g, " ").trim() || "";
}
