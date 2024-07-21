import { useContext } from "react";
import "./GroupItem.scss";
import ChatContext from "../Context/ChatContext";

const GroupItem = ({ group, leaveGroup, updateGroup }: any) => {
    const { loginUserId, setSelectedGroup } = useContext(ChatContext);

    return (
        <div className="group-item list-group-item list-group-item-action d-flex justify-content-between" onClick={() => setSelectedGroup(group)}>
            <span>{group.groupName}</span>
            <div className="actions d-flex">
                {loginUserId === group.adminsId && <div className="update" onClick={() => updateGroup(group)}>
                    <i className="fa fa-pen"></i>
                </div>}
                <div className="remove ml-3" onClick={() => leaveGroup(group)}>
                    <i className="fa fa-trash"></i>
                </div>
            </div>
        </div>
    );
};

export default GroupItem;