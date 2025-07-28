import "./index.css"

const NotificationItem = (props) => {
    const { billDetails } = props;
    const { amountPaid, method, paymentDate } = billDetails;

    return (
        <li className="bill-item">
            <div className="bill-header">
                <h1 className="amount">₹{amountPaid}</h1>
                <span className={`method-tag ${method.toLowerCase()}`}>{method}</span>
            </div>
            <div className="date-container">
                <p className="date">
                    <span className="label">Payment Date:</span> {paymentDate}
                </p>
            </div>
        </li>
    );
};

export default NotificationItem;
