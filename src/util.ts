export function createKeySuggestion(unquotedString: string): string {
  return unquotedString.replace(/[.\s]+/g, "_");
}

export function unquoteString(rawString: string): string {
  return rawString.trim().replace(/(^")|("$)/g, "");
}
