import './Sidebar.scss';
import { useContext, useEffect, useState } from 'react';
import DynamicButton from '../DynamicButton/DynamicButton';
import GroupList from '../GroupList/GroupList';
import CreateGroupForm from '../CreateGroupForm/CreateGroupForm';
import UpdateGroupForm from '../UpdateGroupForm/UpdateGroupForm';
import { IChat } from '../../models/Chat';
import ChatContext from '../Context/ChatContext';
import { IMsg } from '../../models/Msg';

const Sidebar = () => {
    const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
    const [showUpdateGroupForm, setShowUpdateGroupForm] = useState(false);
    const [group, setGroup] = useState<IChat | null>(null);

    let { socket, loginUserId, setAllGroups } = useContext(ChatContext);

    const handleToggleCreateGroupForm = () => {
        setShowCreateGroupForm(!showCreateGroupForm);
    };

    const handleToggleUpdateGroupForm = (group: IChat) => {
        setGroup(group);
        setShowUpdateGroupForm(!showUpdateGroupForm);
    };

    useEffect(() => {
        socket?.on("removeUserFromGroup", (res: { groupId: string, loginUserId: string }) => {
            if(res) {
                setGroup((currGroup: IChat | null) => {
                    if(currGroup && currGroup._id === res.groupId) {
                        return {
                            ...currGroup,
                            users: currGroup.users.filter((user: string) => user !== res.loginUserId)
                        };
                    }
                    return currGroup;
                });
                setAllGroups((prevAllGroups: IChat[]) => {
                    return prevAllGroups.map((prevGroup: IChat) => {
                        if(prevGroup._id === res.groupId) {
                            return {
                                ...prevGroup,
                                users: prevGroup.users.filter((user: string) => user !== res.loginUserId)
                            };
                        }
                        return prevGroup;
                    });
                });
            }
        });
        socket?.on("updateGroup", (res: {groupId: string, groupName: string, userIds: string[], adminsId: string, msgs: IMsg[]}) => {
            if(res) {
                setAllGroups((prevAllGroups: IChat[]) => {
                    const isUserInGroup = res.userIds.some((val: string) => val === loginUserId);
                    if(!isUserInGroup) {
                        return prevAllGroups.filter((group: IChat) => group._id !== res.groupId );
                    }
                    const groupExists = prevAllGroups.some((group: IChat) => group._id === res.groupId);
                    if(groupExists) {
                        return prevAllGroups.map((prevGroup: IChat) => {
                            if(prevGroup._id === res.groupId) {
                                return {
                                    ...prevGroup,
                                    groupName: res.groupName,
                                    users: res.userIds
                                };
                            }
                            return prevGroup;
                        });
                    } else {
                        socket?.emit("setup", res.groupId);
                        return [
                            ...prevAllGroups,
                            {
                                _id: res.groupId,
                                groupName: res.groupName,
                                users: res.userIds,
                                adminsId: res.adminsId,
                                date: new Date().toISOString(),
                                msgs: res.msgs
                            }
                        ]
                    }
                });
            }
        });
    }, [socket, group]);
    

    return (
        <div className="sidebar bg-light p-3">
            {!showCreateGroupForm && <DynamicButton buttonName="Create Group" onToggleCreateGroupForm={handleToggleCreateGroupForm} />}
            {showCreateGroupForm && <CreateGroupForm onClose={handleToggleCreateGroupForm} group={group} />}
            {showUpdateGroupForm && <UpdateGroupForm onClose={handleToggleUpdateGroupForm} selectedGroup={group} />}
            {!(showCreateGroupForm || showUpdateGroupForm) && <GroupList updateGroup={handleToggleUpdateGroupForm} />}
        </div>
    );
};

export default Sidebar;
