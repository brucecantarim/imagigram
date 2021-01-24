import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, Chip, Paragraph, Button, TextInput } from 'react-native-paper';

import firebase from 'firebase';
import 'firebase/firestore';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions/index';

const Comment = ({ currentUser, route, users }) => {
  const { postId, uid } = route.params;
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);

  useEffect(() => {
    if (shouldUpdate) {
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          const comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          const updatedComments = comments.map((item) => {
            if (users) {
              if (item.hasOwnProperty('user')) return item;
              const creator = users?.find((user) => user.uid === item.creator);
              if (creator) {
                item.user = creator;
              } else {
                item.user = currentUser;
              }
              return item;
            }
          });

          setComments(updatedComments);
          setShouldUpdate(false);
        });
    }
  }, [postId, shouldUpdate]);

  const handleCommentSubmit = () => {
    if (comment) {
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .add({
          creator: currentUser.uid,
          comment,
        });
      setComment();
      setShouldUpdate(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <>
            <Chip
              style={{ margin: 12 }}
              avatar={
                <Avatar.Image
                  size={24}
                  source={
                    item?.user?.avatar ||
                    'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg'
                  }
                />
              }
            >
              {item?.user?.name}
            </Chip>
            <Paragraph style={{ marginLeft: 48, marginBottom: 12 }}>
              {item.comment}
            </Paragraph>
          </>
        )}
      />
      <View>
        <TextInput
          placeholder='Leave a comment...'
          onChangeText={(value) => setComment(value)}
        />
        <Button icon='send' mode='contained' onPress={handleCommentSubmit}>
          Send
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
