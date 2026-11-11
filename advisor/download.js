import { chooseRelease, describeRelease, formatBytes } from "./release.js";

const RELEASES_URL =
  "https://api.github.com/repos/ai1place/ai1place.github.io/releases?per_page=20";

const download = document.querySelector("#download");
const meta = document.querySelector("#download-meta");
const fileName = document.querySelector("#download-file");
const checksum = document.querySelector("#checksum");
const digest = document.querySelector("#digest");
const notes = document.querySelector("#notes");
const intel = document.querySelector("#intel");
const windows = document.querySelector("#windows");
const status = document.querySelector("#download-status");

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function setStatus(message, visible) {
  status.textContent = message;
  status.classList.toggle("sr-only", !visible);
}

function showLink(anchor, url, label) {
  if (!anchor) return;
  if (!url) {
    anchor.hidden = true;
    return;
  }
  anchor.hidden = false;
  anchor.href = url;
  if (label) anchor.textContent = label;
}

function applyRelease(described) {
  download.href = described.file.url;
  const parts = [];
  if (described.prerelease) parts.push("Preview");
  if (described.version) parts.push(described.version);
  if (described.file.arch) parts.push(described.file.arch);
  const size = formatBytes(described.file.size);
  if (size) parts.push(size);
  const published = formatDate(described.published);
  if (published) parts.push(published);
  meta.textContent = parts.join(" · ");
  fileName.textContent = described.file.name;
  showLink(checksum, described.checksum, "SHA-256");
  digest.textContent = described.file.digest || "";
  digest.hidden = !described.file.digest;
  showLink(notes, described.notes, "Release notes");
  const intelSize = described.intel ? formatBytes(described.intel.size) : "";
  showLink(
    intel,
    described.intel && described.intel.url,
    intelSize ? `Intel Mac (${intelSize})` : "Intel Mac",
  );
  showLink(windows, described.windows && described.windows.url, "Windows");
  if (windows && described.windows) windows.title = described.windows.name;
  const kind = described.prerelease ? "Preview" : "Release";
  setStatus(
    described.version
      ? `${kind} ${described.version} for ${described.file.arch} is ready.`
      : "The latest macOS build is ready.",
    false,
  );
}

async function loadRelease() {
  const response = await fetch(RELEASES_URL);
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
  const releases = await response.json();
  const described = describeRelease(chooseRelease(releases));
  if (!described) {
    setStatus("No macOS build is published yet. The button opens the releases page.", true);
    return;
  }
  applyRelease(described);
}

loadRelease().catch(() => {
  setStatus("Couldn't reach GitHub releases. The button opens the releases page instead.", true);
});
