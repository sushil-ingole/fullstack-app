import { Socket } from "socket.io-client";
import { IChat } from "./Chat";
import { SetStateAction } from "react";
import { IUser } from "./User";

export interface ChatContextType {
    socket: Socket | null;
    allGroups: IChat[];
    setAllGroups: React.Dispatch<SetStateAction<IChat[]>>;
    selectedGroup: IChat | null;
    setSelectedGroup: React.Dispatch<SetStateAction<IChat | null>>;
    loginUserId: string;
    setLoginUserId: React.Dispatch<SetStateAction<string>>;
    loginUser: IUser | null;
    setLoginUser: React.Dispatch<SetStateAction<IUser | null>>;
}