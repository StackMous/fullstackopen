import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState:'',
  reducers: {
    notificationText(state, action) {
      return (action.payload)
    }
  }
})

/*export const showNotify = (text) => {
  return {
    type: 'notification/text',
    payload: text
  }
}

export const hideNotify = () => {
  return {
    type: 'notification/text',
    payload: ''
  }
}*/

export const {notificationText} = notificationSlice.actions

export const setNotification = (text, timeout) => {
  return async dispatch => {
    dispatch(notificationText(text))
    setTimeout(() => {
      dispatch(notificationText(""))
    }, timeout*1000)
  }
}

//export const createAnecdote = content => {
//  return async dispatch => {
//    const newAnecdote = await anecdoteService.createNew(content)
//    dispatch(appendAnecdote(newAnecdote))
//  }
//}


export default notificationSlice.reducer
