import {
  USERS_DATA_CHANGE,
  USERS_POST_CHANGE,
  USERS_LIKE_CHANGE,
  USERS_LIKE_COUNT_CHANGE,
  CLEAR_DATA,
} from '../constants';

const initialState = {
  users: [],
  feed: [],
  usersFollowingLoaded: 0,
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_CHANGE:
      return {
        ...state,
        users: [...state.users, action.user],
      };
    case USERS_POST_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feed: [...state.feed, ...action.posts],
      };
    case USERS_LIKE_CHANGE:
      return {
        ...state,
        feed: state.feed.map((post) =>
          post.id == action.postId
            ? {
                ...post,
                currentUserLike: action.currentUserLike,
              }
            : post
        ),
      };
    case USERS_LIKE_COUNT_CHANGE:
      return {
        ...state,
        feed: state.feed.map((post) =>
          post.id == action.postId
            ? {
                ...post,
                likes: action.likes,
              }
            : post
        ),
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};

export default users;
