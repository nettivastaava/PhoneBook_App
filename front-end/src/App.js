import React, { useState, useEffect } from 'react'
import Alert from './components/Alert'
import Filter from './components/Filter'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ Notification, setNotification] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  function isIn (persons) {
    return persons.name === newName
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {       
        const personId = persons.find(person => person.name === newName).id
        const personObject = {
          name: newName,
          number: newNumber
        }

        personService
          .update(personId, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personId ? person : returnedPerson))
            setNotification(`Updated ${newName}`)
            setTimeout(() => {
              setNotification('')
            }, 5000)
          })
          .catch(error => {
            console.log(error)  
          })
      }

    } else {
      const personObject = {
        name: newName,
        number: newNumber
      } 

      if (personObject.name.length<3 || personObject.number.length<8) {
        setNotification('Malformed input')
          setTimeout(() => {
            setNotification('')
          }, 5000)
      }


      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setNotification(`Added ${newName}`)
          setTimeout(() => {
            setNotification('')
          }, 5000)
          .catch(error => {
            console.log(error.response.data)
          })
      })

  
      
  }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (props) => {
    if (window.confirm(`Delete ${props.name}?`)) {
      setNotification(`Deleted ${props.name}`)
      setTimeout(() => {
        setNotification('')
      }, 5000)
      personService
        .removePerson(props.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== props.id))
        })
    }
  }

  return (
    <div>
      <Alert message={Notification}/>
      <h2>Phonebook</h2>
        <Filter filter={newFilter} change={handleFilterChange}/>
      <h2>add a new</h2>
      <form onSubmit={addPerson}> 
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      
      <Phonebook persons={persons} filter={newFilter} handleDelete={handleDelete}/>
      
    </div>
  )
}

const Phonebook = (props) => {
  return(
    <table>
      <tbody>
        {props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase())).map(personToShow =>
          <tr key={personToShow.id}>
            <td>{personToShow.name}</td>
            <td>{personToShow.number}</td>
            <td><button type="button" onClick={ () => props.handleDelete(personToShow)}>delete</button></td>
          </tr>)}      
      </tbody>
    </table>
  )
}


 
export default App