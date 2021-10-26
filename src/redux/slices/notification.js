import { createSlice } from '@reduxjs/toolkit';
// utils
import axiosInstance from '../../utils/axios';
import axios from 'axios';

import objFromArray from '../../utils/objFromArray';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  notifications: [],
  socket: null,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    },

    // GET NOTIFICATIONS
    setSocketSuccess(state, action) {
      state.isLoading = false;
      state.socket = action.payload;
    },

  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addRecipients,
  onSendMessage,
  resetActiveConversation
} = slice.actions;

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function getNotifications(email) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      if(email == null || email == undefined) {
        return;
      }
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/notification/get`,
        {
          email: email,
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function setSocket(socket) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(
        slice.actions.setSocketSuccess(socket)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
