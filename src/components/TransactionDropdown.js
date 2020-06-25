import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as firebase from 'firebase'

const displayName = {
    amount: "Amount",
    comment: "Comment",
    dateOccurred: "Date Charged",
    datePaid: "Date Paid",
    name: "Name",
    paid: "Paid",
    topics: "Topics"
}

const TransactionDropdown = ({ transaction, projectKey, transactionKey }) => {
    const [editing, setEditing] = useState(false);
    // const [editObject, setEditObject] = useState({});
    const setEditObject = useState({})[1];

    const formatFieldValue = (fieldName, fieldValue) => {
        let displayValue = fieldValue;
        // console.log(fieldValue + ": " + fieldValue.length)
        if (fieldName === "paid") {
            displayValue = fieldValue ? "Yes" : "No"
        } else if (fieldName === "amount") {
            displayValue = '$' + fieldValue;
        } if (fieldName.length >= 4 && fieldValue !== "n/a" && fieldName.substring(0, 4) === "date") {
            let date = new Date(fieldValue);
            displayValue = date.toDateString();
        }
        return displayValue;
    }

    const handlePaidChange = (newPaid) => {
        const projects = firebase.database().ref('projects');
        const transactions = projects.child(projectKey + "/transactions")
        const transaction = transactions.child(transactionKey);
        const now = (new Date()).toDateString();
        transaction.update({
            paid: newPaid,
            datePaid: newPaid ? now : "n/a"
        })
    }

    const handleDeleteTransaction = (e) => {
        if (!window.confirm("Are you sure you want to delete this transaction"))
            return;
        // const event = e;
        const projects = firebase.database().ref('projects');
        const transactions = projects.child(projectKey + "/transactions")
        const transaction = transactions.child(transactionKey);
        transaction.remove();
    }

    const handleEdit = () => {
        setEditing(true);
        // console.log({ ...transaction })
        setEditObject({ ...transaction })
    }

    // const updateEditObject = (e, fieldName) => {
    //     e.persist();
    //     console.log("trying to edit i guess")
    //     // const data = e;
    //     // const field = fieldName;
    //     // console.log({ ...editObject, [field]: data.target.value })
    //     // setEditObject({ ...editObject, [field]: data })
    // }

    const handleStopEdit = (save) => {
        if (!save && !window.confirm("Are you sure you want to discard your changes?"))
            return;
        setEditing(false);
        if (save) {
            // const projects = firebase.database().ref('projects');
            // const transactions = projects.child(projectKey + "/transactions")
            // const transaction = transactions.child(transactionKey);
            // transaction.update(editObject);
        } else {

        }
    }

    const getInputType = (fieldName) => {
        let type = "";
        switch (fieldName) {
            case "amount":
                type = "number"
                break;
            default:
                break;
        }
        console.log(type)
        return type;
    }

    return (
        <div>
            <ExpansionPanel >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ color: transaction.paid ? "#0F0" : "#F00" }}
                >
                    <div className="topLevelInfo">
                        {formatFieldValue("name", transaction.name)} - {formatFieldValue("dateOccurred", transaction.dateOccurred)}
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="panel" style={{ display: "block" }}>
                    {Object.keys(transaction).map(fieldName => {
                        const value = formatFieldValue(fieldName, transaction[fieldName]);
                        const type = getInputType(fieldName)
                        return (
                            <div key={fieldName}>
                                {displayName[fieldName] ? displayName[fieldName] : fieldName}:
                                {!editing && <>{" " + value}</>}
                                {editing && <input type={type}
                                    value={transaction[fieldName]}
                                    onChange={(e) => setEditObject(e, fieldName)} />}
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

export default TransactionDropdown