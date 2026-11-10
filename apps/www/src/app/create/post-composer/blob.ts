export function revokeBlob(url: string | null) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
}
