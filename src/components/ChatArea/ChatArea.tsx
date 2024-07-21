import { useContext, useEffect, useState } from "react";
import { IChat } from "../../models/Chat";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatMessages from "../ChatMessages/ChatMessages";
import MessageInput from "../MessageInput/MessageInput";
import "./ChatArea.scss";
import { IMsg } from "../../models/Msg";
import ChatContext from "../Context/ChatContext";

const ChatArea = ({ group: initialGroup }: any) => {
    const [group, setGroup] = useState<IChat>(initialGroup);

    const { socket } = useContext(ChatContext);

    useEffect(() => {
        setGroup(initialGroup);
    }, [initialGroup]);

    useEffect(() => {
        socket?.on("receive_notification", (res: IMsg) => {
            setGroup((prevGroup: IChat) => {
                if(prevGroup._id === res._id) {
                    return {
                        ...prevGroup,
                        msgs: [...prevGroup.msgs, res]
                    }
                };
                return prevGroup;
            });
        });
    }, [socket]);

    if (!group) {
        return <div className="chat-area alert alert-info">Please select a group to start chatting</div>;
    }

    const handleOnMessageSent = (updatedGroupInfo: IChat) => {
        setGroup(updatedGroupInfo);
    }

    return (
        <div className="chat-area d-flex flex-column">
            <ChatHeader group={group} />
            <ChatMessages group={group} />
            <MessageInput group={group} messageSend={handleOnMessageSent} />
        </div>
    );
};

export default ChatArea;