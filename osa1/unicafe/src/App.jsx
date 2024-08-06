import { useState } from 'react'

const Header = (props) => {
  console.log(props)
  return (
    <h1>
      {props.text}
    </h1>
  )
}

const Display = (props) => {
  console.log(props)
  return(<div>{props.name} {props.value}</div>)
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  return(
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all}) => {
  if (all == 0) return(
    <div>
      <Display name="No feedback given"/>
    </div>
  )
  else return(
    <table>
      <tbody>
        <StatisticLine name="good" value={good}/>
        <StatisticLine name="neutral" value={neutral}/>
        <StatisticLine name="bad" value={bad}/>
        <StatisticLine name="all" value={all}/>
        <StatisticLine name="average" value={(good - bad) / all}/>
        <StatisticLine name="positive" value={good / all * 100 + " %"}/>
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  const handleGoodClick = () => {
    setAll(all + 1)
    setGood(good + 1)
  }
  
  const handleNeutralClick = () => {
    setAll(all + 1)
    setNeutral(neutral + 1)
  }
  
  const handleBadClick = () => {
    setAll(all + 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <Header text="statistics"/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

export default App