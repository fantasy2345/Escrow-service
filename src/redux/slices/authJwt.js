import jwtDecode from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';
// utils
 import axios from '../../utils/axios';
//import axios from 'axios';
import { ExceptionMap } from 'antd/lib/result';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: {
      id: '8864c717-587d-472a-929a-8e5f298024da-0',
      displayName: 'Jaydon Frankie',
      email: 'demo@minimals.cc',
      password: 'demo1234',
      photoURL: '/static/mock-images/avatars/avatar_default.jpg',
      phoneNumber: '+40 777666555',
      country: 'United States',
      address: '90210 Broadway Blvd',
      state: 'California',
      city: 'San Francisco',
      zipCode: '94116',
      about: '',
      role: 'admin',
      isPublic: true
    }
};

const slice = createSlice({
  name: 'authJwt',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // INITIALISE
    getInitialize(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = initialState.user;
    },

    // LOGIN
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // REGISTER
    registerSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // REGISTER
    profileUpdateSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    // LOGOUT
    logoutSuccess(state) {
      state.isAuthenticated = true;
      state.user = null;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ----------------------------------------------------------------------

export function login({ email, password }) {
  return async (dispatch) => {
    // const response = await axios.post(
    //   `${process.env.REACT_APP_API_URL}/setup/signin/email`,
    //   {
    //     email: email,
    //     password: password
    //   }
    // );
    const response = await axios.post('/api/account/login', {
      email,
      password
    });
    const { accessToken, user } = response.data;
    //const accessToken = response.data.token;
    setSession(accessToken);

    // const user = {
    //   displayName: response.data.user.display_name,
    //   email: response.data.user.email,
    //   walletAddress: response.data.user.walletAddress,
    //   role: response.data.user.role,
    //   photoURL:
    //     `${process.env.REACT_APP_API_URL}/` + response.data.user.avartar,
    //   country: response.data.user.country
    // };

    dispatch(slice.actions.loginSuccess({ user }));
  };
}

// ----------------------------------------------------------------------

export function register({ email, password, firstName, lastName, role }) {
  return async (dispatch) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/setup/signup/email`, {
      email,
      password,
      firstName,
      lastName,
      role
    });
  };
}

// ----------------------------------------------------------------------

export function profileUpdate({
  displayName,
  email,
  walletAddress,
  country,
  photoURL
}) {
  return async (dispatch) => {
    const accessToken = window.localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/setup/updateprofile`,
      {
        displayName,
        email,
        walletAddress,
        country,
        photoURL
      },
      {
        headers: { Authorization: accessToken }
      }
    );

    const { token, user } = response.data;

    const authUser = {
      displayName: user.display_name,
      email: user.email,
      role: user.role,
      photoURL: `${process.env.REACT_APP_API_URL}/` + user.avartar,
      walletAddress: user.walletAddress,
      country: user.country
    };

    setSession(null);
    setSession(token);

    dispatch(slice.actions.profileUpdateSuccess({ user: authUser }));
  };
}

// ----------------------------------------------------------------------

export function logout() {
  return async (dispatch) => {
    setSession(null);
    dispatch(slice.actions.logoutSuccess());
  };
}

// ----------------------------------------------------------------------

export function getInitialize() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      const accessToken = window.localStorage.getItem('accessToken');

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get('/api/account/my-account');
        const decoded = jwtDecode(accessToken);

        const user = {
          displayName: decoded.sub.display_name,
          email: decoded.sub.email,
          walletAddress: decoded.sub.walletAddress,
          role: decoded.sub.role,
          photoURL: `${process.env.REACT_APP_API_URL}/` + decoded.sub.avartar,
          country: decoded.sub.country
        };

        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: true,
            user: user
          })
        );
      } else {
        dispatch(
          slice.actions.getInitialize({
            isAuthenticated: false,
            user: null
          })
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        slice.actions.getInitialize({
          isAuthenticated: false,
          user: null
        })
      );
    }
  };
}
