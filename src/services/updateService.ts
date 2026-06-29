const GITHUB_API = "https://api.github.com/repos/Itskeer/quran-companion/releases/latest";
const CURRENT_VERSION = "1.0.2";

export interface UpdateInfo {
  available: boolean;
  version: string;
  downloadUrl: string;
  releaseNotes: string;
}

export async function checkForUpdates(): Promise<UpdateInfo> {
  try {
    const res = await fetch(GITHUB_API);
    if (!res.ok) return { available: false, version: CURRENT_VERSION, downloadUrl: "", releaseNotes: "" };
    const data = await res.json();
    const latestVersion = data.tag_name?.replace("v", "") || "";
    const available = latestVersion !== "" && latestVersion !== CURRENT_VERSION;
    const exeAsset = data.assets?.find((a: { name: string }) => a.name.endsWith(".exe"));
    return {
      available,
      version: latestVersion,
      downloadUrl: exeAsset?.browser_download_url || "",
      releaseNotes: data.body || "",
    };
  } catch {
    return { available: false, version: CURRENT_VERSION, downloadUrl: "", releaseNotes: "" };
  }
}
