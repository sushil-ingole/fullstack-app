import { createContext } from "react";
import { ChatContextType } from "../../models/ChatContextType";
import { IChat } from "../../models/Chat";
import { IUser } from "../../models/User";

const context: ChatContextType = {
    socket: null, 
    allGroups: [],
    setAllGroups: () => {},
    selectedGroup: {} as IChat,
    setSelectedGroup: () => {},
    loginUserId: "",
    setLoginUserId: () => {},
    loginUser: {} as IUser,
    setLoginUser: () => {}
};

const ChatContext = createContext<ChatContextType>(context);

export default ChatContext;