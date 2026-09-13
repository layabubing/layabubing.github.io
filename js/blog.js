const POSTS_API = "https://api.github.com/repos/layabubing/layabubing.github.io/contents/posts";

const parseFrontMatter = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  let body = text;

  if (match) {
    body = text.slice(match[0].length);
    match[1].split(/\r?\n/).forEach((line) => {
      const pair = line.match(/^(\w+):\s*(.*)$/);
      if (pair) meta[pair[1]] = pair[2].trim();
    });
  }

  return { meta, body };
};

const postItem = ({ slug, title, date, excerpt }) => `
  <a class="post-item" href="post.html?slug=${encodeURIComponent(slug)}">
    <span class="post-date">${date || ""}</span>
    <span class="post-info">
      <span class="post-title">${title || slug}</span>
      ${excerpt ? `<span class="post-excerpt">${excerpt}</span>` : ""}
    </span>
  </a>`;

const loadPosts = async () => {
  const list = document.querySelector("#post-list");
  const response = await fetch(POSTS_API);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const files = (await response.json()).filter((f) => f.name.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.name.replace(/\.md$/, "");
      try {
        const text = await (await fetch(file.download_url)).text();
        const { meta } = parseFrontMatter(text);
        return { slug, title: meta.title, date: meta.date, excerpt: meta.excerpt };
      } catch {
        return { slug, title: slug, date: "", excerpt: "" };
      }
    }),
  );

  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  list.innerHTML = posts.length
    ? posts.map(postItem).join("")
    : '<p class="data-fallback">还没有随笔。</p>';
};

loadPosts().catch(() => {
  document.querySelector("#post-list").innerHTML =
    '<p class="data-fallback">随笔列表加载失败，请稍后再试。</p>';
});
