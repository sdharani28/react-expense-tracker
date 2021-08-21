import React, { Fragment, useState } from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';

import './App.css';

function App() {

    const [transactions, setTransactions] = useState([]);

    const addTransaction = (transaction) => {
        const tempTransactions = [transaction, ...transactions];
        setTransactions(tempTransactions);
    };

    const deleteTransaction = (id) => {
        const tempTransactions = transactions.filter(transaction => transaction.id !== id  );
        setTransactions(tempTransactions);
    };

    return (
        <Fragment>
            <Header />
            <div className="container">
                <Balance transactions={transactions}/>
                <IncomeExpenses transactions={transactions}/>
                <TransactionList transactions={transactions} deleteTransaction={deleteTransaction}/>
                <AddTransaction addTransaction={addTransaction}/>
            </div>
        </Fragment>
    );
}

export default App;
