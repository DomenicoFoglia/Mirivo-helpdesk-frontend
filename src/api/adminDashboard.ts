import api from './axios'

export const statsApi = async () => {
    
    return api.get('/admin/dashboard/stats');                                
}

export const detailsApi = async () => {
    return api.get('/admin/dashboard/details');
}