import { useContext, useEffect, useState } from 'react';
import "./UpdateGroupForm.scss";
import { IUser } from '../../models/User';
import ChatContext from '../Context/ChatContext';
import { getallusers, updategroupinfo } from '../api.service';
import { IChat } from '../../models/Chat';

const UpdateGroupForm = ({ onClose, selectedGroup }: any) => {
    const [groupName, setGroupName] = useState('');
    const [allUsers, setallUsers] = useState<IUser[] | []>([]);

    const { socket, loginUserId, setAllGroups } = useContext(ChatContext);

    const getAllUsers = async () => {
        const json = await getallusers();
        let { success, data } = json;
        if (success) {
            data.forEach((user: IUser) => {
                if (selectedGroup.users.includes(user._id)) {
                    user.isSelected = true;
                }
            });
            setallUsers(data);
        }
    }

    const handleAddRemoveUser = (user: IUser, toAdd: boolean) => {
        setallUsers((prevUsers: IUser[]) => {
            return prevUsers.map((prevUser: IUser) => {
                if (prevUser._id === user._id) {
                    return { ...prevUser, isSelected: toAdd };
                }
                return prevUser;
            });
        });
    };

    const handleUpdateGroup = async () => {
        if (loginUserId?.length && groupName?.length && allUsers?.length) {
            const userIds = allUsers.filter((user: IUser) => user.isSelected).map((user: IUser) => user._id);
            userIds.forEach((userId: string) => {
                if(userId !== loginUserId) {
                    socket?.emit("updateGroup", {groupId: selectedGroup._id, groupName, userIds, userId, adminsId: selectedGroup.adminsId, msgs: selectedGroup.msgs});
                }
            });
            const json = await updategroupinfo(selectedGroup._id, groupName, userIds);
            const { success, data } = json;
            if (success) {
                setAllGroups((prevGroup: IChat[]) => {
                    return prevGroup.map((group: IChat) => {
                        if(group._id === data._id) {
                            return {
                                ...group,
                                groupName: data.groupName,
                                users: [...group.users, data.users]
                            }
                        }
                        return group;
                    });
                });
                onClose();
            } else {
                const { error } = json;
                console.log(error);
            }
        }
    }

    useEffect(() => {
        setallUsers((prevUsers: IUser[]) => {
            return prevUsers.map((prevUser: IUser) => {
                if (selectedGroup.users.some((val: string) => val === prevUser._id)) {
                    return { ...prevUser, isSelected: true };
                } else {
                    return { ...prevUser, isSelected: false };
                }
            });
        });
    }, [selectedGroup]);

    useEffect(() => {
        setGroupName(selectedGroup.groupName);
        getAllUsers();
    }, []);

    return (
        <div className="create-group-form">
            <button className="btn close-button" onClick={onClose}>X</button>
            <div className="form-group">
                <label htmlFor="groupName">Group Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                />
            </div>
            <div className="selected-users-container">
                {allUsers?.map((user: IUser) => (
                    user.isSelected &&
                    <span className='selected-user' key={user._id} onClick={() => handleAddRemoveUser(user, false)}>
                        {user.name}
                    </span>
                ))}
                {!allUsers?.some((user: IUser) => user.isSelected) && <span className='no-user-selected'>No users selected.</span>}
            </div>
            <div className="form-group">
                <p className='select-users-label'>Select Users</p>
                <div className="userSelection">
                    {allUsers.map((user: IUser) => (
                        !user.isSelected && loginUserId != user._id &&
                        <p className='select-users' key={user._id} onClick={() => handleAddRemoveUser(user, true)}>
                            {user.name}
                        </p>
                    ))}
                </div>
            </div>
            <button className="btn btn-success mt-3" onClick={handleUpdateGroup}>
                Update Group
            </button>
        </div>
    );
};

export default UpdateGroupForm;