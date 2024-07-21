import { useContext, useEffect, useRef, useState } from "react";
import "./ChatMessages.scss";
import { IMsg } from "../../models/Msg";
import ChatContext from "../Context/ChatContext";
import { likeMsg } from "../api.service";

const ChatMessages = ({ group }: any) => {
    const [messages, setMessages] = useState<IMsg[] | []>([]);
    const { socket, loginUserId } = useContext(ChatContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializedMessages = group.msgs.map((message: any) => ({
            ...message,
            likes: message.likes || []
        }));
        setMessages(initializedMessages);

    }, [group]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleDoubleClick = (index: number) => {
        const newMessages: IMsg[] = [...messages];
        const message: IMsg = newMessages[index];
        if(message?.likes) {
            if (message.likes.includes(loginUserId)) {
                message.likes = message.likes.filter((id: string) => id !== loginUserId);
            } else {
                message.likes.push(loginUserId);
            }
            setMessages(newMessages);
            if(group._id?.length && messages?.length) {
                likeMsg(group._id, messages);
            }
            const bodyData = { groupId: group._id, msgs: messages };
            socket?.emit("likemsg", bodyData);
        }
    };

    return (
        <div className="chat-messages flex-grow-1 p-3 border rounded">
            {messages.map((message: IMsg, index: number) => (
                <div
                    key={index}
                    className="message p-2 mb-2 bg-light rounded"
                    onDoubleClick={() => handleDoubleClick(index)}
                >
                    {loginUserId !== message.sender ? (
                        <div className="left-msg">
                            <strong>{message.name}</strong> : <span>{message.content}</span>
                        </div>
                    ) : null}
                    {loginUserId === message.sender ? (
                        <div className="right-msg">
                            <span>{message.content}</span> : <strong>{message.name}</strong>
                        </div>
                    ) : null}
                    {message?.likes && message.likes.length > 0 && (
                        <div className="like-count">
                            <span role="img" aria-label="like">👍</span> {message.likes.length}
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
