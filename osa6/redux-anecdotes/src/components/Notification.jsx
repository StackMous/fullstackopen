import { useSelector } from 'react-redux'

const Notification = () => {
  const notifText = useSelector(({notification}) => {
    console.log(notification)
    return notification
  })
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (notifText !== '') return (
    <div style={style}>
      {notifText}
    </div>
  ) 
  return(<div></div>)
}

export default Notification