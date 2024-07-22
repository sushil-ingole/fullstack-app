import { useContext, useEffect } from "react";
import "./ChatApp.scss";
import ChatArea from "../ChatArea/ChatArea";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import ChatContext from "../Context/ChatContext";
import { fetchAllGroups } from "../api.service";
import { IChat } from "../../models/Chat";

const ChatApp = () => {
    const { socket, selectedGroup, loginUserId, allGroups, setAllGroups } = useContext(ChatContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(loginUserId?.length) {
            socket?.emit("setup", loginUserId);
        }
        getAllGroups();
    }, [socket]);

    async function getAllGroups() {
        try {
            if(loginUserId?.length) {
                const json = await fetchAllGroups(loginUserId);
                const { success, data } = json;
                if (success) {
                    if (data?.length) {
                        data.forEach((chat: IChat) => {
                            socket?.emit("setup", chat._id);
                        });
                    }
                    setAllGroups(data);
                } else {
                    const { error } = json;
                    console.log(error);
                }
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    if (!allGroups) {
        // Optionally, you can render a loading state here
        return <div>Loading...</div>;
    }

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <div className="container-fluid chat-app position-relative">
            <button className="btn btn-danger logout-button" onClick={handleLogout}>
                Logout
            </button>
            <div className="row">
                <div className="col-md-3">
                    <Sidebar />
                </div>
                <div className="col-md-9">
                    <ChatArea group={selectedGroup} />
                </div>
            </div>
        </div>
    );
}

export default ChatApp;