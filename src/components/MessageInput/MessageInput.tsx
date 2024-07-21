import "./MessageInput.scss";
import { useContext, useState } from 'react';
import ChatContext from "../Context/ChatContext";
import { IMsg } from "../../models/Msg";
import { addMessageToChat } from "../api.service";

const MessageInput = ({ group, messageSend }: any) => {
    const [message, setMessage] = useState('');
    const { socket, loginUser } = useContext(ChatContext);

    const handleSendMessage = async () => {
        if (loginUser) {
            const notification: IMsg = {
                _id: group._id,
                sender: loginUser._id,
                content: message,
                name: loginUser.name,
                date: new Date().toISOString()
            };
            socket?.emit("send_user_notification", notification);
            setMessage("");
            const json = await addMessageToChat(notification);
            const { success, data } = json;
            if (success) {
                messageSend(data);
            } else {
                const { error } = json;
                console.log("error: ", error);
            }
        }
    };

    return (
        <div className="message-input input-group mt-3">
            <input
                type="text"
                className="form-control"
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" ? handleSendMessage() : null}
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default MessageInput;