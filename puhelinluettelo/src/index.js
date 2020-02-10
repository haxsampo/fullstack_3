import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import addressService from './services/address'



const Field = ({ onUpdate, value, inputText }) => (
    <div>
        {inputText} <input
            value={value}
            onChange={onUpdate}
        />
    </div>
)

const AddingField = ({ fields, addName }) => (
    <form onSubmit={addName}>
        <h2>Lisää sällää</h2>
        {fields.map( f => <Field key={f.key} onUpdate={f.onUpdate} value={f.value} inputText={f.inputText} />)}
        <div>
            <button type="submit">add</button>
        </div>
    </form>

)

const DelButt = ({number, delFunction}) => {
    return (
    <button onClick={() => delFunction(number)}>
        delete
    </button>
    )
}

const NumbersComp = ({contactsToShow, delFunction}) => (
    <div>
        <h2>Numbers</h2>
        {contactsToShow.map(p => <div key={p.name}>
             {p.name} {p.number}
             <DelButt number={p.id} delFunction={delFunction}/>
             </div>)}
    </div>
)

const App = () => {
    const [persons, setPersons] = useState([
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [suodatin, setSuodatin] = useState('')


    //MMISSÄ VAIHEESSA TOI ID LISÄTÄÄN, VOIKO DELETENAPPI KÄYTTÄÄ HUOLETTA IDTÄ? NANI KOKEILE SILLEEN ETTÄ KÄYTTÄÄ, HUOLEHDI ONGELMISTA MYÖHEMMIN
    const addName = (event) => {
        event.preventDefault();
        if (persons.find(person => newName === person.name)) {
            alert(`${newName} ei kelpaa, haista vittu`);
        } else {
            const uusiNimNro = {name: newName, number: newNumber}
            addressService
                .create(uusiNimNro)
                .then(returnedAddress => {
                    setPersons(persons.concat(returnedAddress))
                    console.log(persons)
                    setNewName('')
                    setNewNumber('')
                })
        }
    }

    useEffect(() => {
        addressService
            .getAll()
            .then(initialAddress => {
                setPersons(initialAddress)
            })
    }, [])

    const fields = [
        {
            onUpdate: e => setNewName(e.target.value),
            value: newName,
            inputText: 'Name: ',
            key: 'newNameField'
        },
        {
            onUpdate: e => setNewNumber(e.target.value),
            value: newNumber,
            inputText: 'Number: ',
            key: 'newNumberField'
        }
    ]

    const delFunction = (name) => {
        if(window.confirm("Poistetaanko ", name,"?")) {
            addressService
                .delNum(name)
                .then( ret => {
                    addressService
                        .getAll()
                        .then(data => {
                            setPersons(data)
                        })
                })
        } else {
            console.log("juuei mitään")
        }       
    }

    let contactsToShow;
    if (suodatin.length === 0) {
        contactsToShow = persons;
    } else {
        contactsToShow = persons.filter(contact => contact.name.toLowerCase().includes(suodatin.toLowerCase()))
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Field onUpdate={e => setSuodatin(e.target.value)} inputText='filter shown with: '/>
            <AddingField fields={fields} addName={addName} />           
            <NumbersComp contactsToShow={contactsToShow} delFunction={delFunction} />
        </div>
    )

}

ReactDOM.render(
    <App />,
    document.getElementById('root'))

export default App