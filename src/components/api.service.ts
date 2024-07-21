import { IMsg } from "../models/Msg";

const apiPrefix = "http://localhost:5100";

export const login = async (email: string, password: string): Promise<any> => {
    const res = await fetch(`${apiPrefix}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    return json;
};
export const createGroup = async (groupName: string, userIds: string[], adminsId: string): Promise<any> => {
    const res = await fetch(`${apiPrefix}/creategroup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ groupName, userIds, adminsId })
    });
    const json = await res.json();
    return json;
};
export const fetchAllGroups = async (userId: string): Promise<any> => {
    const res = await fetch(`${apiPrefix}/getallgroups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ userId: userId })
    });
    const json = await res.json();
    return json;
};

export const removeUserFromGroup = async (groupId: string, loginUserId: string): Promise<any> => {
    const res = await fetch(`${apiPrefix}/removeuserfromgroup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ groupId: groupId, userId: loginUserId })
    });
    const json = await res.json();
    return json;
};
export const likeMsg = async (groupId: string, msgs: IMsg[]): Promise<any> => {
    const res = await fetch(`${apiPrefix}/likemsg`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ groupId: groupId, msgs: msgs })
    });
    const json = await res.json();
    return json;
};
export const addMessageToChat = async (notification: IMsg): Promise<any> => {
    const res = await fetch(`${apiPrefix}/addMessageToChat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify(notification)
    });
    const json = await res.json();
    return json;
};
export const updategroupinfo = async (groupId: string, groupName: string, users: string[]): Promise<any> => {
    const res = await fetch(`${apiPrefix}/updategroupinfo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ groupId, groupName, users })
    });
    const json = await res.json();
    return json;
};
export const getallusers = async (): Promise<any> => {
    const res = await fetch(`${apiPrefix}/getallusers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        }
    });
    const json = await res.json();
    return json;
};
export const signup = async (name: string, email: string, password: string): Promise<any> => {
    const res = await fetch(`${apiPrefix}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": sessionStorage.getItem("token") ?? ""
        },
        body: JSON.stringify({ name, email, password })
    });
    const json = await res.json();
    return json;
};