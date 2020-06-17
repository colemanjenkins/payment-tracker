import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as firebase from 'firebase'

const displayName = {
    amount: "Amount",
    comment: "Topics and Comment",
    dateOccurred: "Date Charged",
    datePaid: "Date Paid",
    name: "Name",
    paid: "Paid"
}

const TransactionDropdown = ({ transaction, projectKey, transactionKey }) => {

    const formatFieldValue = (fieldName, fieldValue) => {
        let displayValue = fieldValue;
        if (fieldName === "paid") {
            displayValue = fieldValue ? "Yes" : "No"
        }
        return displayValue;
    }

    const chooseFieldColor = () => {
        let color;
        if (!transaction.paid) {
            color = "#F00"
        } else {
            color = "#0F0"
        }
        return color
    }

    const handlePaidChange = (newPaid) => {
        const projects = firebase.database().ref('projects');
        const project = projects.child(projectKey + '/transactions/' + transactionKey);
        project.update({
            paid: newPaid
        })
    }

    let ct = -1;
    const fieldNames = Object.keys(transaction)
    return (
        <div>
            <ExpansionPanel >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ color: chooseFieldColor() }}
                >
                    <Typography className="heading">
                        <div className="topLevelInfo">
                            {transaction.name} - {transaction.dateOccurred}
                        </div>
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="panel" style={{ display: "block" }}>
                    {Object.values(transaction).map(fieldValue => {
                        ct++;
                        const fieldName = fieldNames[ct];
                        return (
                            <div key={fieldName}>{displayName[fieldName] ? displayName[fieldName] : fieldName}: {formatFieldValue(fieldName, fieldValue)}</div>
                        )
                        // <div>{fieldNames[ct]}: {fieldValue}</div>
                    })}
                    {!transaction.paid && <button onClick={() => handlePaidChange(true)}>Mark as Paid</button>}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

export default TransactionDropdown