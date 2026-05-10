import api from './axios'

export const registerApi = async (name: string, surname: string, email: string, password: string, 
    passwordConfirmation: string, companyName: string, logo: File) => {
        const formData = new FormData();
        formData.append('user[name]', name);
        formData.append('user[surname]', surname);
        formData.append('user[email]', email);
        formData.append('user[password]', password);
        formData.append('user[password_confirmation]', passwordConfirmation);
        formData.append('company[name]', companyName);
        formData.append('company[logo]', logo);

    return api.post('/auth/register', formData);

}