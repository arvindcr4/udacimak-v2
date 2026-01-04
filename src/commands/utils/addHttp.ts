/**
 * Add https protocol to url if missing
 * @param url - The URL to add protocol to
 * @returns url with https protocol
 */
export default function addHttp(url: string): string {
  url = url.trim();
  // remove all protocols, JSON data sometimes contain invalid protocols
  // so it's best to remove them then add valid protocol again
  url = url
    .replace(/^(?:f|ht)tps?\:\/{1,}/, '')
    .replace(/^\/{1,}/, '');

  url = `https://${url}`;
  return url;
}
