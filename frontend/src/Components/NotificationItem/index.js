import "./index.css"

const NotificationItem=(props)=>{
    const {notificationDetails}=props;
    const {title,message,createdAt}=notificationDetails;
    return (
        <li className="notification-item">
            <h1 className="title">{title}</h1>
            <p className="message">{message}</p>
            <div className="date-container">
                <p className="date-time"><span className="span-element">Posted At:</span> {createdAt}</p>
            </div>
        </li>
    )
}   
export default NotificationItem;