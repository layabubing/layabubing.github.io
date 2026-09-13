const statusClass = (type) =>
  type === "active" ? "status status-active" : type === "wip" ? "status status-wip" : "status";

const projectRow = (item, index, { withTags = true } = {}) => `
  <article class="project-row${item.featured ? " project-row-featured" : ""}">
    <div class="row-meta">
      <span class="row-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="row-tag">${item.tag}</span>
    </div>
    <div class="row-body">
      <div class="row-title-line">
        <h3>${item.title}</h3>
        <span class="${statusClass(item.statusType)}">${item.status}</span>
      </div>
      <p>${item.desc}</p>
      ${
        withTags && item.tags?.length
          ? `<ul class="tag-row" aria-label="技术标签">${item.tags.map((t) => `<li>${t}</li>`).join("")}</ul>`
          : ""
      }
    </div>
    <a class="row-link" href="${item.url}" target="_blank" rel="noreferrer">打开仓库</a>
  </article>`;

const archiveLink = (item) => `
  <a href="${item.url}" target="_blank" rel="noreferrer">
    <span>${item.title}</span>
    <small>${item.note}</small>
  </a>`;

const loadProjects = async () => {
  const response = await fetch("data/projects.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const renderProjectsPage = (data) => {
  const personal = document.querySelector("#personal-list");
  const org = document.querySelector("#org-list");
  const archive = document.querySelector("#archive-list");

  if (personal) personal.innerHTML = data.personal.map((p, i) => projectRow(p, i)).join("");
  if (org) org.innerHTML = data.org.map((p, i) => projectRow(p, i)).join("");
  if (archive) archive.innerHTML = data.archive.map(archiveLink).join("");
};

const renderHomeFeatured = (data) => {
  const mount = document.querySelector("#home-featured");
  if (!mount) return;

  const featured = data.personal.filter((p) => p.homeFeatured).slice(0, 2);
  mount.innerHTML = featured
    .map((p, i) => projectRow({ ...p, featured: false }, i, { withTags: false }))
    .join("");
};

loadProjects()
  .then((data) => {
    renderProjectsPage(data);
    renderHomeFeatured(data);
  })
  .catch(() => {
    document
      .querySelectorAll("#personal-list, #org-list, #archive-list, #home-featured")
      .forEach((el) => {
        el.innerHTML = '<p class="data-fallback">项目数据加载失败，请通过 https 访问本站。</p>';
      });
  });
