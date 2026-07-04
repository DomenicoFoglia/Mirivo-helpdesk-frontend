export function storageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    return `${import.meta.env.VITE_API_URL}/storage/${path}`
}