import { useContext, useState } from "react";
import "./SignUp.scss";
import { useNavigate } from "react-router-dom";
import ChatContext from "../Context/ChatContext";
import { signup } from "../api.service";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const { socket, setLoginUserId, setLoginUser } = useContext(ChatContext);

    const handleSignUpSubmit = async (e: any) => {
        e.preventDefault();
        const { success, authToken, data, error } = await signup(name, email, password);
        if (success) {
            sessionStorage.setItem("token", authToken);
            sessionStorage.setItem("loginUser", JSON.stringify(data));
            setLoginUser(data);
            sessionStorage.setItem("loginUserId", data._id);
            socket?.emit("setup", data._id);
            setLoginUserId(data._id);
            navigate('/chatapp');
        } else {
            setErrorMsg(error);
            console.log("Invalid signup.");
        }
    }
    return (
        <form className="container-fluid d-flex justify-content-center align-items-center flex-column" onSubmit={handleSignUpSubmit}>
            <div className="form">
                <div className="form-group">
                    <label htmlFor="email">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="nameHelp" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <p className="text-danger">{errorMsg}</p>
                <p className="sign-in-link" onClick={() => navigate('/login')}>Already have an account? <span>Sign In</span></p>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    )
}

export default SignUp;
