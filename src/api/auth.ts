import api from './axios'

export const loginApi = async (email: string, password: string) => {

    return api.post('/auth/login', {
        email : email,
        password : password
    });

}