import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatContext from "./ChatContext";
import { IChat } from "../../models/Chat";
import { IUser } from "../../models/User";

const ChatState = (props: any) => {
    const [allGroups, setAllGroups] = useState<IChat[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<IChat | null>(null);
    const [loginUserId, setLoginUserId] = useState<string>(() => {
        const loginId = sessionStorage.getItem("loginUserId");
        return loginId ?? "";
    });
    const [loginUser, setLoginUser] = useState<IUser | null>(() => {
        const user = sessionStorage.getItem("loginUser");
        return user ? JSON.parse(user) : null;
    });
    let socket = useRef<any | null>(io("http://localhost:5100"));

    useEffect(() => {
        socket.current = io("http://localhost:5100");
        return () => {
            socket.current?.disconnect();
        };
    }, [socket]);

    if (!socket) {
        // Optionally, you can render a loading state here
        return <div>Loading...</div>;
    }

    const obj = useMemo(() => ({
        socket: socket.current, 
        allGroups: allGroups, 
        selectedGroup: selectedGroup,
        loginUserId: loginUserId,
        loginUser: loginUser,
        setAllGroups: setAllGroups,
        setSelectedGroup: setSelectedGroup,
        setLoginUserId: setLoginUserId,
        setLoginUser: setLoginUser
    }), [socket, allGroups, selectedGroup, loginUserId, loginUser]);
    return (
        <ChatContext.Provider value={obj}>
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatState;
