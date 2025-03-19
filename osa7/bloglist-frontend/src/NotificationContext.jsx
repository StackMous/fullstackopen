import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  console.log(`reducerissa ${JSON.stringify(action)}`)
  switch (action.type) {
    case 'SHOW':
      return action.value
    case 'HIDE':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notificationAndDispatch] = useContext(NotificationContext)
  return notificationAndDispatch
}

export const useNotify = () => {
  const valueAndDispatch = useContext(NotificationContext)
  const dispatch = valueAndDispatch[1]
  return payload => {
    dispatch({ type: 'SHOW', value: payload })
    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 5000)
  }
}

export default NotificationContext
