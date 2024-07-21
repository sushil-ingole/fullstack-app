import { IMsg } from "./Msg";

export interface IChat {
    _id: string;
    groupName: string;
    users: string[];
    adminsId: string;
    date: string;
    msgs: IMsg[];
}