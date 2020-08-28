import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withFirebase } from '../Firebase';

import './TransactionDropdown.css';


const displayName = {
    amount: "Amount",
    comment: "Comment",
    dateOccurred: "Date Charged",
    datePaid: "Date Paid",
    name: "Name",
    paid: "Paid",
    topics: "More Info"
}

const TransactionDropdown = ({ transaction, projectKey, transactionKey, firebase }) => {
    const [editing, setEditing] = useState(false);
    const [editObject, setEditObject] = useState({});

    const formatFieldValue = (fieldName, fieldValue) => {
        let displayValue = fieldValue;
        if (fieldName === "paid") {
            displayValue = fieldValue ? "Yes" : "No";
        } else if (fieldName === "amount") {
            displayValue = '$' + fieldValue;
        } if (fieldName.length >= 4 && fieldValue !== "n/a" && fieldName.substring(0, 4) === "date") {
            let date = new Date(fieldValue);
            displayValue = date.toDateString();
        }
        return displayValue;
    }

    const handlePaidChange = (newPaid) => {
        const now = (new Date()).toString();

        firebase.transaction(projectKey, transactionKey).update({
            paid: newPaid,
            datePaid: newPaid ? now : "n/a"
        })
    }

    const handleDeleteTransaction = () => {
        if (!window.confirm("Are you sure you want to delete this transaction"))
            return;
        firebase.transaction(projectKey, transactionKey).remove();
    }

    const handleEdit = () => {
        setEditing(true);
        setEditObject({ ...transaction })
    }

    const updateEditObject = (e, fieldName, type) => {
        const data = e;
        const field = fieldName;

        let val = data.target.value;
        if (type === "number")
            val = Number(val);

        setEditObject({ ...editObject, [field]: val })
    }

    const handleStopEdit = (save) => {
        if (!save && !window.confirm("Are you sure you want to discard your changes?"))
            return;

        setEditing(false);

        if (save) {
            firebase.transaction(projectKey, transactionKey).update(editObject);
        }
    }

    const getInputType = (fieldName) => {
        let type;
        switch (fieldName) {
            case "amount":
                type = "number"
                break;
            default:
                type = "text"
                break;
        }
        return type;
    }

    const formatAmount = (amount) => {
        let cents = String(Math.round((amount * 100) % 100));
        if (cents.length === 1) {
            cents = "0" + cents;
        }
        const dollars = (Math.floor(amount / 1)).toLocaleString();
        return dollars + "." + cents;
    }

    if (!transaction)
        return <div></div>;
    return (
        <div className="Dropdown">
            <ExpansionPanel style={{ backgroundColor: "#506680" }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <div className={"topLevelInfo"} >
                            <div className={"PanelTitle" + (transaction.paid ? " paid" : " notPaid")}>
                                {formatFieldValue("name", transaction.name)}
                            </div>
                            <div className="PanelSubtitle">
                                {formatFieldValue("dateOccurred", transaction.dateOccurred)}
                            </div>
                        </div>
                        <div className="amountDisplay">
                            ${formatAmount(transaction.amount)}
                        </div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="panel" style={{ display: "block" }}>
                    {Object.keys(transaction).map(fieldName => {
                        const value = formatFieldValue(fieldName, transaction[fieldName]);
                        const type = getInputType(fieldName)
                        return (
                            <div key={fieldName}>
                                <b>{displayName[fieldName] ? displayName[fieldName] : fieldName}:</b>
                                {!editing && <>{" " + value}</>}
                                {editing && <input type={type}
                                    value={editObject[fieldName]}
                                    onChange={(e) => updateEditObject(e, fieldName, type)} />}
                            </div>
                        )
                        // <div>{fieldNames[ct]}: {fieldValue}</div>
                    })}
                    {!transaction.paid && <button onClick={() => handlePaidChange(true)}>Mark as Paid</button>}
                    {transaction.paid && <button onClick={() => handlePaidChange(false)}>Mark as Unpaid</button>}
                    <button onClick={handleDeleteTransaction}>Delete Transaction</button>
                    {!editing && <button onClick={handleEdit}>Edit</button>}
                    {editing && <button onClick={() => handleStopEdit(true)}>Save Edits</button>}
                    {editing && <button onClick={() => handleStopEdit(false)}>Discard Changes</button>}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

export default withFirebase(TransactionDropdown)