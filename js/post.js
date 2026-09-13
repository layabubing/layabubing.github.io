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

const loadPost = async () => {
  const headerEl = document.querySelector("#post-header");
  const bodyEl = document.querySelector("#post-body");
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug || !/^[\w-]+$/.test(slug)) {
    bodyEl.innerHTML = '<p class="data-fallback">缺少文章参数。</p>';
    return;
  }

  const response = await fetch(`posts/${encodeURIComponent(slug)}.md`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const { meta, body } = parseFrontMatter(await response.text());
  const title = meta.title || slug;

  document.title = `${title} · Downloading / layabubing`;
  headerEl.innerHTML = `
    ${meta.date ? `<p class="eyebrow">${meta.date}</p>` : ""}
    <h1 class="page-title post-heading">${title}</h1>`;
  bodyEl.innerHTML = DOMPurify.sanitize(marked.parse(body));
};

loadPost().catch(() => {
  document.querySelector("#post-body").innerHTML =
    '<p class="data-fallback">文章加载失败，请确认链接是否正确。</p>';
});
