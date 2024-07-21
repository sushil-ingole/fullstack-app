import { useContext, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import ChatContext from "../Context/ChatContext";
import { login } from "../api.service";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { socket, setLoginUserId, setLoginUser } = useContext(ChatContext);

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        if(email?.length && password?.length) {
            const { success, authToken, data } = await login(email, password);
            if (success) {
                sessionStorage.setItem("loginUser", JSON.stringify(data));
                setLoginUser(data);
                sessionStorage.setItem("loginUserId", data._id);
                setLoginUserId(data._id);
                socket?.emit("setup", data._id);
                sessionStorage.setItem("token", authToken);
                navigate('/chatapp');
            } else {
                console.log("Invalid login.");
            }
        }
    }
    return (
        <form className="container-fluid d-flex justify-content-center align-items-center flex-column" onSubmit={handleLoginSubmit}>
            <div className="form">
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <p className="sign-up-link" onClick={() => navigate('/signup')}>Don't have an account? <span>Sign Up</span></p>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    )
}

export default Login;
