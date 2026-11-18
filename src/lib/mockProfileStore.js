import { safeImageUrl } from "./safeUrl";

const STORAGE_PREFIX = "sp:mock-profile:";
const CHANGE_EVENT = "sp:mock-profile-change";
const COVER_MAX_WIDTH = 828;

const text = (value) => (typeof value === "string" ? value.trim() : "");
const storageKey = (slug) => `${STORAGE_PREFIX}${String(slug).toLowerCase()}`;

export function readMockProfileRaw(slug) {
  try {
    return window.localStorage.getItem(storageKey(slug));
  } catch {
    return null; 
  }
}

export function parseMockProfile(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const socials = data.socials && typeof data.socials === "object" ? data.socials : {};
    return {
      name: text(data.name),
      role: "",
      bio: text(data.bio),
      isVerified: false,
      coverImageUrl: typeof data.coverImageUrl === "string" && data.coverImageUrl.startsWith("data:image/") ? data.coverImageUrl : "",
      avatarImageUrl: safeImageUrl(data.avatarImageUrl),
      socials: { instagram: text(socials.instagram), tiktok: text(socials.tiktok), facebook: text(socials.facebook) },
      campaignCount: 0, // A brand-new page has no campaigns yet.
    };
  } catch {
    return null;
  }
}

export function subscribeMockProfile(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function coverToDataUrl(file) {
  if (!file) return "";
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, COVER_MAX_WIDTH / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff"; // PNG transparency becomes white instead of black in the JPEG.
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    try {
      return await readAsDataUrl(file);
    } catch {
      return "";
    }
  }
}

// `keepCover`: the current cover (data URL) to keep when no new photo is chosen.
export async function saveMockProfile({ slug, account, bio, socials, photo, keepCover }) {
  const profile = {
    name: account?.name,
    avatarImageUrl: account?.avatarUrl,
    bio,
    socials,
    coverImageUrl: (await coverToDataUrl(photo)) || (typeof keepCover === "string" && keepCover.startsWith("data:image/") ? keepCover : ""),
  };
  try {
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(profile));
    } catch {
      window.localStorage.setItem(storageKey(slug), JSON.stringify({ ...profile, coverImageUrl: "" }));
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {

  }
}
