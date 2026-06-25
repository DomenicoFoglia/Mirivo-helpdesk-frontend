import api from "./axios"

export const downloadAttachmentApi = async (id: number, originalFilename: string) => {
    const response = await api.get(`/attachments/${id}/download`, {
        responseType: 'blob'
    });
    
    // Crea un URL temporaneo dal Blob
    const url = window.URL.createObjectURL(response.data);
    
    // Crea un <a> invisibile e clicca
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFilename;
    document.body.appendChild(link);
    link.click();
    
    // Pulisci
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

export const previewAttachmentUrl = (id: number): string => {
    return `${api.defaults.baseURL}/attachments/${id}/preview`;
}

export const deleteAttachmentApi = async (id: number) => {
    return api.delete(`/attachments/${id}`);
}