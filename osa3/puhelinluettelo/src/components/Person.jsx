const Person = ({name, number, removePerson}) => {
    console.log(name, number, removePerson)
    return (
      <li>
        {name} {number}
        <button onClick={removePerson}>delete</button>
      </li>
    )
  }

  export default Person