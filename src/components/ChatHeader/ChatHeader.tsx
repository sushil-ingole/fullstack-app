import "./ChatHeader.scss";

const ChatHeader = ({ group }: any) => {
    return (
        <div className="chat-header bg-primary text-white p-3">
            <h2>{group.groupName}</h2>
            {/* Additional controls can be added here */}
        </div>
    );
};

export default ChatHeader;