import { useState, useEffect } from 'react'
import Person from './components/Person'
import AddPerson from './components/AddPerson'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Error from './components/Error'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [newError, setNewError] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const alreadyExists = persons.find(n => n.name === newName)
    
    if (newName !== '') {
      if (alreadyExists) {
        if (window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )) {
          const changedPerson = {...alreadyExists, number: newNumber}
          personService
            .update(changedPerson.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.name !== returnedPerson.name ? p : returnedPerson))
              setNewName('')
              setNewNumber('')
              showNotification(`Modified ${returnedPerson.name}`)
          })
        }
      } else {
        personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Added ${returnedPerson.name}`)
          })
          .catch(error => {
            console.log("no jo nyt on saatana")
            console.log(`${error.response.data.error}`)
            showError(`${error.response.data.error}`)
          })
      }
    }
  }

  const removePerson = name => {
    if (window.confirm(`Delete ${name}?`)) {
      const person = persons.find(n => n.name === name)
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(n => n.name !== name))
          showNotification(`Removed ${person.name}`)
        })
        .catch(error => {
          showError(`${person.name} was already deleted from server`)
          setPersons(persons.filter(n => n.name !== name))
        })
    }
  }

  const showNotification = message => {
    setNewMessage(message)
    setTimeout(() => {
      setNewMessage(null)
    }, 3000)
  }

  const showError = message => {
    setNewError(message)
    setTimeout(() => {
      setNewError(null)
    }, 3000)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  const namesToShow = persons.filter(person => 
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} />
      <Error message={newError} />
      <Filter filter={newFilter} change={handleFilterChange}/>
      <h2>add a new</h2>
      <AddPerson addName={addName} newName={newName} nameChange={handleNameChange}
        newNumber={newNumber} numberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
        {namesToShow.map(person => 
           <Person 
            key={person.name} 
            name={person.name} 
            number={person.number}
            removePerson={() => removePerson(person.name)}
           />
        )}
      </ul>
    </div>
  )
}

export default App