import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, Chip, Searchbar } from 'react-native-paper';

import firebase from 'firebase';
import 'firebase/firestore';

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (query) => {
    firebase
      .firestore()
      .collection('users')
      .where('name', '>=', query)
      .get()
      .then((snapshot) => {
        const _users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(_users);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Searchbar placeholder='Search user...' onChangeText={fetchUsers} />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <Chip
            style={{ margin: 12, marginBottom: 0 }}
            avatar={
              <Avatar.Image
                size={24}
                source={
                  item?.avatar ||
                  'https://wealthspire.com/wp-content/uploads/2017/06/avatar-placeholder-generic-1.jpg'
                }
              />
            }
            onPress={() => navigation.navigate('Profile', { uid: item?.id })}
          >
            {item?.name}
          </Chip>
        )}
      />
    </View>
  );
};

export default Search;
