const AddPerson = ({addName, newName, nameChange, newNumber, numberChange}) => {
    return(  
      <form onSubmit={addName}>
      <div>name: 
        <input 
          value={newName} 
          onChange={nameChange}
        />
      </div>
      <div>number: 
        <input 
          value={newNumber} 
          onChange={numberChange}
        />
      </div>
      <button type="submit">add</button>
      </form>
    )
  }

  export default AddPerson