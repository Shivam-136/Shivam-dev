
export async function downloadResume(url, filename = "Shivam_Chhanchhan_Resume.pdf") {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // release memory shortly after triggering the download
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.warn("Forced download failed, opening in new tab instead:", err);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}