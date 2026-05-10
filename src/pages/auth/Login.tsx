import { useState } from "react"
import { loginApi } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

function Login() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword] = useState('');

    const { login } = useAuthStore()

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        try{
            const response = await loginApi(email, password);
            const { token, user} = response.data;
            login(user,token);
            navigate(`/${user.role}/dashboard`);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" value={email} onChange={(e) =>setEmail(e.target.value)}/>

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) =>setPassword(e.target.value)}/>

                <button type="submit">Accedi</button>
            </form>
        </>
    )
}

export default Login