import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  Paragraph,
  Caption,
  Button,
} from 'react-native-paper';
import { connect } from 'react-redux';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const Feed = ({ feed, following, navigation, usersFollowingLoaded }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (usersFollowingLoaded == following.length && following.length !== 0) {
      feed.sort((x, y) => x.creation - y.creation);
      setPosts(feed);
    }
  }, [usersFollowingLoaded, feed]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  const Loading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator animating={true} color={'#ff7300'} size='large' />
    </View>
  );

  return (
    <View style={styles.container}>
      {!posts && <Loading />}
      <View style={styles.gallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <Card>
              <Card.Title
                title={item?.user?.name}
                subtitle={item?.user?.email}
                left={(props) => (
                  <Avatar.Image
                    size={24}
                    {...props}
                    source={
                      item?.user?.avatar ||
                      'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg'
                    }
                  />
                )}
              />
              <Card.Content>
                <View style={styles.images}>
                  <Image
                    style={styles.image}
                    source={{ uri: item?.downloadURL }}
                  />
                </View>
                <Paragraph>{item?.caption}</Paragraph>
                <Card.Actions>
                  <Caption>{item?.likes}</Caption>
                  {item.currentUserLike ? (
                    <Button
                      icon='heart-remove'
                      onPress={() => onDislikePress(item.user.uid, item.id)}
                    >
                      Dislike
                    </Button>
                  ) : (
                    <Button
                      icon='heart'
                      onPress={() => onLikePress(item.user.uid, item.id)}
                    >
                      Like
                    </Button>
                  )}
                  <Button
                    icon='comment-arrow-right'
                    onPress={() => {
                      navigation.navigate('Comment', {
                        postId: item.id,
                        uid: item.user.uid,
                      });
                    }}
                  >
                    View comments...
                  </Button>
                </Card.Actions>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gallery: {
    flex: 1,
  },
  images: {
    flex: 1,
    height: 300,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);
