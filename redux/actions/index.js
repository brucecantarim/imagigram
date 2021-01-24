import {
  USER_STATE_CHANGE,
  USER_POST_CHANGE,
  USER_FOLLOWING_CHANGE,
  USERS_DATA_CHANGE,
  USERS_POST_CHANGE,
  USERS_LIKE_COUNT_CHANGE,
  USERS_LIKE_CHANGE,
  CLEAR_DATA,
} from '../constants';
import firebase from 'firebase';
import 'firebase/firestore';

export const clearData = () => {
  return (dispatch) => dispatch({ type: CLEAR_DATA });
};

export const fetchUser = () => {
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          dispatch({ type: USER_STATE_CHANGE, currentUser: { ...data, uid } });
        }
      });
  };
};

export const fetchUserPosts = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POST_CHANGE, posts });
      });
  };
};

export const fetchUserFollowing = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        const following = snapshot.docs.map((doc) => doc.id);
        dispatch({ type: USER_FOLLOWING_CHANGE, following });
        following.map((value, index) => {
          dispatch(fetchUsersData(following[index], true));
        });
      });
  };
};

export const fetchUsersData = (uid, getPosts) => {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();
            dispatch({ type: USERS_DATA_CHANGE, user: { ...data, uid } });
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
};

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find((el) => el.uid === uid);

        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        posts.map((post) => {
          dispatch(fetchUsersFollowingLikes(uid, post.id));
        });

        dispatch({ type: USERS_POST_CHANGE, posts, uid });
      });
  };
}

export function fetchUsersFollowingLikes(uid, postId) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .onSnapshot((snapshot) => {
        const likes = snapshot.docs.length;
        dispatch({ type: USERS_LIKE_COUNT_CHANGE, postId, likes });
      });

    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        const postId = snapshot.ZE.path.segments[3];

        let currentUserLike = false;
        if (snapshot.exists) currentUserLike = true;

        dispatch({ type: USERS_LIKE_CHANGE, postId, currentUserLike });
      });
  };
}
