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

export const {notificationText} = notificationSlice.actions

export const setNotification = (text, timeout) => {
  return async dispatch => {
    dispatch(notificationText(text))
    setTimeout(() => {
      dispatch(notificationText(""))
    }, timeout*1000)
  }
}

export default notificationSlice.reducer
