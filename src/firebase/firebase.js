// firebase.js
// contains the Firebase context and provider

import React, { createContext, useState } from 'react'
import firebaseConfig from './firebaseConfig';
import app from 'firebase/compat/app';
import 'firebase/compat/database';

// we create a React Context, for this to be accessible
// from a component later
const FirebaseContext = createContext(null)
export { FirebaseContext }

function FirebaseProvider({ children }) {
    let firebase = {
        app: null,
        database: null,
        api: {
            getExpenses: getRuntimeExpenses,
            addExpense: addExpense
        },
    }

    const [expenses, setExpenses] = useState([]);

    // check if firebase app has been initialized previously
    // if not, initialize with the config we saved earlier
    if (!app.apps.length) {
        app.initializeApp(firebaseConfig);
        firebase = {
            app: app,
            database: app.database(),

            api: {
                getExpenses: getRuntimeExpenses,
                addExpense: addExpense
            },
        }
    }

    // function to query Expenses from the database
    async function getExpenses() {
        try {
            const snapshot = await firebase.database.ref('expenses').once('value')

            const vals = await snapshot.val();
            let _records = [];
            for (var key in vals) {
                _records.push({
                    ...vals[key],
                    id: key
                });
            }

            setExpenses(_records);

            return _records;
        } catch (error) {
            console.error(`error while getExpenses :: ${error}`);
        }
    }

    async function getRuntimeExpenses() {
        try {
            firebase.database.ref('expenses').on('value', (snapshot) => {
                const vals = snapshot.val();
                let _records = [];
                for (var key in vals) {
                    _records.push({
                        ...vals[key],
                        id: key
                    });
                }
                console.log(`_records : ${JSON.stringify(_records)}`)
                setExpenses(_records);
            })
        } catch (error) {
            console.error(`error while getExpenses :: ${error}`);
        }
    }

    async function addExpense(itemTitle, itemAmount) {
        try {

            let expenseRef = await firebase.database.ref('expenses');
            let res = await expenseRef.push({
                text: itemTitle,
                amount: itemAmount
            });

            console.log(res.getKey())

            // const doc = await firebase.database.ref('expenses').push().set({
            //     text: itemTitle,
            //     amount: itemAmount
            // });
            // console.log(`doc : ${JSON.stringify(doc)}`);
            // let tempExpenses = [...firebase.expenses];
            // tempExpenses.push(doc);
            // firebase = { ...firebase, expenses: tempExpenses }
        } catch (error) {
            console.error(`error while adding transaction :: ${error}`);
        }
    }

    return (
        <FirebaseContext.Provider value={{ firebase, expenses }}>
            {children}
        </FirebaseContext.Provider>
    )
}

export default FirebaseProvider;