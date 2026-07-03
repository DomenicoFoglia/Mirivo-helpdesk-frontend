export function storageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    return `http://localhost:8000/storage/${path}`
}