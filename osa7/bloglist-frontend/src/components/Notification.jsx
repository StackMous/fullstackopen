import { Alert } from 'react-bootstrap'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (notification === '') {
    return null
  }

  return (
    <div className='container'>
      {notification && (notification.includes('failed') || notification.includes('wrong')) ? (
        <Alert variant='danger'>{notification}</Alert>
      ) : (
        <Alert variant='success'>{notification}</Alert>
      )}
    </div>
  )
}

export default Notification
