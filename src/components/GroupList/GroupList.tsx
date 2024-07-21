import "./GroupList.scss";
import GroupItem from '../GroupItem/GroupItem';
import { useContext, useEffect, useState } from "react";
import { IChat } from "../../models/Chat";
import { IMsg } from "../../models/Msg";
import ChatContext from "../Context/ChatContext";
import { removeUserFromGroup } from "../api.service";

const GroupList = ({ updateGroup }: any) => {
    const [filteredGroups, setFilteredGroups] = useState<IChat[]>([]);

    let { socket, allGroups, setAllGroups, setSelectedGroup, loginUserId } = useContext(ChatContext);

    useEffect(() => {
        socket?.on("receive_notification", (res: IMsg) => {
            setAllGroups((prevAllGroups: IChat[]) => {
                return prevAllGroups.map((prevAllGroup: IChat) => {
                    if (prevAllGroup._id === res._id) {
                        return {
                            ...prevAllGroup,
                            msgs: [...prevAllGroup.msgs, res]
                        };
                    }
                    return prevAllGroup;
                });
            });
        });
        socket?.on("msgliked", (res: { groupId: string, msgs: IMsg[] }) => {
            console.log("msgliked: ", res);
            setAllGroups((prevAllGroups: IChat[]) => {
                return prevAllGroups.map((prevAllGroup: IChat) => {
                    if (prevAllGroup._id === res.groupId) {
                        return {
                            ...prevAllGroup,
                            msgs: res.msgs
                        };
                    }
                    return prevAllGroup;
                });
            });
            setSelectedGroup((selectedGroup: IChat | null) => {
                if (selectedGroup?._id === res.groupId) {
                    return {
                        ...selectedGroup,
                        msgs: res.msgs
                    };
                }
                return selectedGroup;
            });
        });
    }, [socket]);

    useEffect(() => {
        console.log("allGroups: ", allGroups);

        setFilteredGroups(allGroups);
    }, [allGroups]);

    const handleLeaveGroup = async (group: IChat) => {
        if(group._id?.length && loginUserId?.length) {
            socket?.emit("removeUserFromGroup", {groupId: group._id, loginUserId: loginUserId});
            const json = await removeUserFromGroup(group._id, loginUserId);
            const { success, data } = json;
            if (success) {
                setAllGroups((prevUsers: IChat[]) => {
                    return prevUsers.filter((prevUser: IChat) => prevUser._id !== group._id);
                })
                group = data;
            } else {
                const { error } = json;
                console.log(error);
            }
        }
    }

    const onSearchFilter = (groupName: any) => {
        groupName = groupName.trim();
        if (groupName?.length) {
            const groupsList = allGroups.filter((val: IChat) => val.groupName.toLocaleLowerCase().includes(groupName.toLocaleLowerCase()));
            setFilteredGroups(groupsList);
        } else {
            setFilteredGroups(allGroups);
        }
    }

    if(!allGroups) {
        return;
    }

    return (
        <div className="group-list list-group">
            <input type="text" placeholder="Search Group" className="form-control mb-2" onChange={(e) => onSearchFilter(e.target.value)} />
            {filteredGroups?.map((group: IChat) => (
                <GroupItem key={group._id} group={group} leaveGroup={handleLeaveGroup} updateGroup={updateGroup} />
            ))}
        </div>
    );
};

export default GroupList;