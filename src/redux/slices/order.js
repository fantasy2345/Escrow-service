import { map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axiosInstance from '../../utils/axios';
import axios from 'axios';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  posts: [],
  authors: [],
  editors: [],
  orderdetail: [],
  orderresult: [],
  orderattach: [],
  review: [],
  authorid: null
};

const slice = createSlice({
  name: 'order',
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

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET ALL AUTHORS
    getAllAuthorsSuccess(state, action) {
      state.isLoading = false;
      state.authors = action.payload;
    },

    // GET ALL AUTHORS
    getAllEditorsSuccess(state, action) {
      state.isLoading = false;
      state.editors = action.payload;
    },
    
    // GET ALL DETAILSS
    getOrderDetailSuccess(state, action) {
      state.isLoading = false;
      state.orderdetail = action.payload;
    },

    // GET ALL ORDER RESULT
    getOrderResultSuccess(state, action) {
      state.isLoading = false;
      state.orderresult = action.payload;
    },

    // GET ALL ORDER ATTACH
    getOrderAttachSuccess(state, action) {
      state.isLoading = false;
      state.orderattach = action.payload;
    },

    // GET AUTHOR ID
    getOrderAuthorIdSuccess(state, action) {
      state.isLoading = false;
      state.authorid = action.payload;
    },

    // GET REVIEW
    getOrderReviewSuccess(state, action) {
      state.isLoading = false;
      state.review = action.payload;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/profile');
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/posts');
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAllAuthors() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/setup/getallusersbyrole`,
        {
          role: 2
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getAllAuthorsSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAllEditors() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/setup/getallusersbyrole`,
        {
          role: 1
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getAllEditorsSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getOrderDetail(orderid) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/byid`,
        {
          id: orderid
        },
        {
          headers: { Authorization: accessToken }
        }
      );

      dispatch(slice.actions.getOrderDetailSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrderResult(orderid) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/result`,
        {
          id: orderid
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getOrderResultSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrderAttach(orderid) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/attach`,
        {
          id: orderid
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getOrderAttachSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setOrderReviewId(rating, description, orderid) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/setorderreview`,
        {
          id: orderid,
          rating: rating,
          description: description
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getOrderResultSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getReviewByEmail(email, order_id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/review/get`,{
          email,
          order_id
        },
        {
          headers: { Authorization: accessToken }
        }
      )
      dispatch(slice.actions.getOrderReviewSuccess(response.data.review));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
