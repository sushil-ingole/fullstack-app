import { useContext, useEffect, useState } from 'react';
import "./CreateGroupForm.scss";
import { IUser } from '../../models/User';
import ChatContext from '../Context/ChatContext';
import { createGroup, getallusers } from '../api.service';

const CreateGroupForm = ({ onClose }: any) => {
    const [groupName, setGroupName] = useState('');
    const [allUsers, setallUsers] = useState<IUser[] | []>([]);
    const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
    const { loginUserId } = useContext(ChatContext);

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

    const handleCreateGroup = () => {
        if(loginUserId?.length && groupName?.length && allUsers?.length) {
            const userIds: string[] = allUsers.filter((user: IUser) => user.isSelected).map((user: IUser) => user._id);
            userIds.push(loginUserId);
            const adminsId = loginUserId;
            createGroup(groupName, userIds, adminsId);
        }
    }

    const getAllUsers = async () => {
        const json = await getallusers();
        const { success, data } = json;
        if (success) {
            setallUsers(data);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
      setFilteredUsers(allUsers);
    }, [allUsers]);
    

    const onSearchFilter = (userName: any) => {
        userName = userName.trim();
        if(userName?.length) {
            const usersList = allUsers.filter((val: IUser) => val.name.toLocaleLowerCase().includes(userName.toLocaleLowerCase()));
            setFilteredUsers(usersList);
        } else {
            setFilteredUsers(allUsers);
        }
    }

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
                <input type="text" placeholder="Search Group" className="form-control mb-2" onChange={(e) => onSearchFilter(e.target.value)} />
                <div className="userSelection">
                    {filteredUsers.map((user: IUser) => (
                        !user.isSelected && loginUserId != user._id &&
                        <p className='select-users' key={user._id} onClick={() => handleAddRemoveUser(user, true)}>
                            {user.name}
                        </p>
                    ))}
                </div>
            </div>
            <button className="btn btn-success mt-3" onClick={handleCreateGroup}>
                Create Group
            </button>
        </div>
    );
};

export default CreateGroupForm;