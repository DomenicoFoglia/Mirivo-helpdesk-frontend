import api from './axios'

export const getMeApi = () => {

    return api.get('/user');

}