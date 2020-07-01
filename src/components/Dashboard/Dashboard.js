import React, { useEffect, useState } from 'react';
import TransactionDropdown from './TransactionDropdown.js';
import { withFirebase } from '../Firebase'

const Dashboard = props => {
    const [project, setProject] = useState(null);
    const [projectKey, setProjectKey] = useState(null);
    const [keys, setKeys] = useState([])

    useEffect(() => {
        const { firebase } = props;
        firebase.project('-MAi71AwrAqMf5VecbjI').on('value', snap => {
            sortTransactions(snap.val());
            setProject(snap.val());
            setProjectKey(snap.key);
        })
    }, [props])

    const sortTransactions = (projectData) => {
        const sortField = "dateOccurred";
        let orderedKeys = [];
        if (projectData) {
            orderedKeys = Object.keys(projectData.transactions);
            orderedKeys.sort(function (a, b) {
                const dateA = new Date(projectData.transactions[a][sortField]);
                const dateB = new Date(projectData.transactions[b][sortField]);
                return dateB - dateA;
            })
        }
        setKeys(orderedKeys);
    }

    const handleAddTransaction = () => {
        const { firebase } = props;
        firebase.project(projectKey).once('value').then(snap => {
            let newTransaction = snap.val().defaultTransaction;
            if (newTransaction.dateOccurred === "now")
                newTransaction.dateOccurred = (new Date()).toString();
            firebase.transactions().push(newTransaction)
        })
    }

    const payTransactions = (transactionKeys) => {
        const { firebase } = props;
        for (let i = 0; i < transactionKeys.length; i++) {
            const now = (new Date()).toString();
            firebase.transaction(projectKey, transactionKeys[i]).update({
                paid: true,
                datePaid: now
            })
        }

    }

    const payAll = () => {
        if (!project)
            return;
        const transactionKeys = Object.keys(project.transactions);
        const transactions = Object.values(project.transactions);

        let payList = [];

        let paidValue = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (!transactions[i].paid) {
                paidValue += transactions[i].amount;
                payList.push(transactionKeys[i])
            }
        }

        const confirmed = window.confirm("Are you sure you want to pay " + payList.length + " transactions for $" + paidValue + "?");

        if (confirmed) {
            payTransactions(payList);
            return paidValue;
        }

        return 0;
    }

    const calculateTotal = () => {
        if (project) {
            const transactions = Object.values(project.transactions);
            let total = 0;

            for (let i = 0; i < transactions.length; i++) {
                if (!transactions[i].paid)
                    total += transactions[i].amount
            }
            return total;
        }
        return 0;
    }

    return (
        <div className="App">
            <h1>{project ? project.name + " - " : ""} Dashboard</h1>
            <div>
                Total Due: ${calculateTotal()}
            </div>
            <button onClick={payAll}>Pay All</button>
            {project && keys.map(transactionKey => {
                return <TransactionDropdown key={transactionKey}
                    transaction={project.transactions[transactionKey]}
                    projectKey={projectKey}
                    transactionKey={transactionKey} />
            })}
            <button onClick={handleAddTransaction}>Create Session</button>
        </div>
    );
}

export default withFirebase(Dashboard);