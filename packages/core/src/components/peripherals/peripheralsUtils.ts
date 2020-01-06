/**
 * factory function to generate a download-trigger
 * e.g. onClick-handler
 * @param blob the blob to download inside the function
 */
export const blobDownloadTriggerFactory = (blob: Blob, fileName: string) => () => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};
