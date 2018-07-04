/**
 * Fetch some text
 * @param {string | Request} input The input to pass to the fetch function
 */
async function fetchText(input) {
  const res = await fetch(input);
  if (!res.ok) {
    throw Error('Resource not ok', input, res.statusText);
  }
  return await res.text();
}
