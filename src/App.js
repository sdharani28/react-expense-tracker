import React, { Fragment, useState, useEffect, useContext } from 'react';
import { FirebaseContext } from './firebase/firebase';

import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';

import './App.css';

function App() {
    const { firebase: {api}, expenses } = useContext(FirebaseContext);
    
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const expenses = await api.getExpenses();
            // setTransactions(expenses);
        }
        fetchExpenses();
    }, []);

    useEffect(() => {
    }, [expenses]);

    const addTransaction = async (transaction) => {
        await api.addExpense(transaction.text, transaction.amount);
        // const tempTransactions = [transaction, ...transactions];
        // setTransactions(tempTransactions);
    };

    const deleteTransaction = (id) => {
        const tempTransactions = transactions.filter(transaction => transaction.id !== id  );
        setTransactions(tempTransactions);
    };

    return (
        <Fragment>
            <Header />
            <div className="container">
                <Balance transactions={expenses}/>
                <IncomeExpenses transactions={expenses}/>
                <TransactionList transactions={expenses} deleteTransaction={deleteTransaction}/>
                <AddTransaction addTransaction={addTransaction}/>
            </div>
        </Fragment>
    );
}

export default App;
