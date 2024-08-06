import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Header = ({text}) => (<h1>{text}</h1>)

const Display = ({votes, index}) => {
  console.log('anecdote', index, 'has', votes, 'points')
  return(
    <div>has {votes} votes</div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint16Array(8))
  
  const chooseNextAnecdote = () => {
    let index = Math.floor(Math.random() * 8)
    console.log('new index', index)
    setSelected(index)
  }
  
  const voteAnecdote = () => {
    console.log('voting for', selected)
    const kopsu = [...points]
    kopsu[selected] += 1
    console.log('points', kopsu)
    setPoints(kopsu)
  }

  let maxIndex = points.indexOf(Math.max(...points));

  return (
    <div>
      <Header text="Anecdote of the day"/>
      {anecdotes[selected]}
      <Display votes={points[selected]} index={selected}/>
      <div>
        <Button handleClick={voteAnecdote} text="vote" />
        <Button handleClick={chooseNextAnecdote} text="next anecdote" />
      </div>
      <Header text="Anecdote with most votes"/>
      {anecdotes[maxIndex]}
      <Display votes={points[maxIndex]} index={maxIndex}/>
    </div>
  )
}

export default App