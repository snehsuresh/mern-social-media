export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});
export const LoginSuccess = (userCredentials) => ({
  type: "LOGIN_SUCCESS",
  payload: userCredentials, //goes through reducer
});
export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});
export const UpdatePic = (picture) => ({
  type: "UPDATE_PROFILE_PICTURE",
  payload: picture,
});

export const LogOut = () => ({
  type: "LOGOUT",
  payload: false,
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const Refresh = () => ({
  type: "REFRESH",
});
