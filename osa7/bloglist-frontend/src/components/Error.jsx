import { useNotificationValue } from '../NotificationContext'
import { Alert } from 'react-bootstrap'

const Error = () => {
  const notification = useNotificationValue()
  if (notification === '') {
    return null
  }

  return (
    <div className='container'>
      <Alert variant='danger'>{notification}</Alert>
    </div>
  )
}

export default Error
