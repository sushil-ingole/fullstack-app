import "./DynamicButton.scss";

const DynamicButton = ({onToggleCreateGroupForm, buttonName}: any) => {

    return (
        <button className="btn btn-primary mb-3" onClick={onToggleCreateGroupForm}>{buttonName}</button>
    );
};

export default DynamicButton;