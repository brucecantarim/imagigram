import {
  USER_STATE_CHANGE,
  USER_POST_CHANGE,
  USER_FOLLOWING_CHANGE,
  CLEAR_DATA,
} from '../constants';

const initialState = {
  currentUser: null,
  posts: [],
  following: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POST_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };
    case USER_FOLLOWING_CHANGE:
      return {
        ...state,
        following: action.following,
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};

export default user;
