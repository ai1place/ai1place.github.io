// Picks the macOS disk image from this site's own GitHub Releases.
// The Advisor source repo is private, so the public page cannot read it.
// Publish Advisor_X.Y.Z_aarch64.dmg (and its .sha256) on this repository.

const REPO = "ai1place/ai1place.github.io";
const RELEASE_PREFIX = `/${REPO}/releases/download/`;
const NOTES_PREFIX = `/${REPO}/releases/tag/`;

const ARCHES = [
  { id: "arm", label: "Apple silicon", pattern: /aarch64|arm64/i },
  { id: "intel", label: "Intel", pattern: /x86_64|x64|amd64/i },
];

export function archOf(name) {
  return ARCHES.find((arch) => arch.pattern.test(name)) || { id: "mac", label: "macOS" };
}

export function isDiskImage(asset) {
  return typeof asset?.name === "string" && /\.dmg$/i.test(asset.name);
}

function isWindows(asset) {
  return typeof asset?.name === "string" && /\.(msi|msix|exe)$/i.test(asset.name);
}

// Only the browser download URL for a file on this repo. Anything else
// (the API asset URL, another host, a crafted path) is dropped.
export function assetUrl(asset) {
  const url = asset?.browser_download_url;
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") return null;
  if (parsed.username || parsed.password) return null;
  if (!parsed.pathname.startsWith(RELEASE_PREFIX)) return null;
  const rest = parsed.pathname.slice(RELEASE_PREFIX.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash !== rest.lastIndexOf("/")) return null;
  const tag = rest.slice(0, slash);
  const file = rest.slice(slash + 1);
  if (!tag || !file || file !== asset.name) return null;
  return parsed.toString();
}

export function notesUrl(release) {
  const url = release?.html_url;
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") return null;
  if (parsed.username || parsed.password) return null;
  if (!parsed.pathname.startsWith(NOTES_PREFIX)) return null;
  const tag = parsed.pathname.slice(NOTES_PREFIX.length);
  if (!tag || tag.includes("/")) return null;
  return parsed.toString();
}

export function versionOf(release) {
  const tag = typeof release?.tag_name === "string" ? release.tag_name : "";
  const stripped = tag.replace(/^v(?=\d)/, "");
  return stripped || "";
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function describedAsset(asset) {
  const url = assetUrl(asset);
  if (!url) return null;
  const arch = archOf(asset.name);
  return {
    name: asset.name,
    url,
    size: typeof asset.size === "number" ? asset.size : null,
    arch: arch.label,
    archId: arch.id,
    digest: typeof asset.digest === "string" ? asset.digest : "",
  };
}

// Newest stable release whose disk image is a real download on this repo.
// If none is stable yet, the newest pre-release that qualifies. Drafts
// are ignored. `releases` is in GitHub's order, newest first.
export function chooseRelease(releases) {
  if (!Array.isArray(releases)) return null;
  const usable = releases.filter((release) => release && !release.draft && describeRelease(release));
  return usable.find((release) => !release.prerelease) || usable[0] || null;
}

export function describeRelease(release) {
  if (!release) return null;
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const disks = assets
    .filter(isDiskImage)
    .map(describedAsset)
    .filter(Boolean)
    .sort((a, b) => rank(a.archId) - rank(b.archId));
  if (disks.length === 0) return null;
  const primary = disks[0];
  const intel = primary.archId === "arm" ? disks.find((disk) => disk.archId === "intel") : null;
  const checksumAsset = assets.find((asset) => asset?.name === `${primary.name}.sha256`);
  const windowsAsset = assets.find(isWindows);
  return {
    version: versionOf(release),
    prerelease: Boolean(release.prerelease),
    published: typeof release.published_at === "string" ? release.published_at : "",
    notes: notesUrl(release),
    file: primary,
    intel: intel || null,
    checksum: checksumAsset ? assetUrl(checksumAsset) : null,
    windows: windowsAsset ? describedAsset(windowsAsset) : null,
  };
}

function rank(archId) {
  if (archId === "arm") return 0;
  if (archId === "intel") return 1;
  return 2;
}
