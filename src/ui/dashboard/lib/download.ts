// Client-side "save this text as a file" via a Blob + a transient anchor. Kept
// in its own module so views call one function and unit tests mock the blob/
// anchor mechanics. Revokes the object URL after a tick (the click is sync).
export function downloadText(filename: string, mime: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
