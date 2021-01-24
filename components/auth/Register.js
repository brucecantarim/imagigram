import React, { useState } from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async () => {
    const res = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({ name, email });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <TextInput placeholder='Nome' onChangeText={setName} />
      <TextInput placeholder='E-mail' onChangeText={setEmail} />
      <TextInput
        placeholder='Password'
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        icon='account-plus-outline'
        mode='contained'
        onPress={handleSubmit}
      >
        Submit
      </Button>
    </View>
  );
};

export default Register;
