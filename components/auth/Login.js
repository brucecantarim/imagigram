import React, { useState } from 'react';
import firebase from 'firebase';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async () => {
    const res = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  };

  return (
    <View>
      <TextInput placeholder='E-mail' onChangeText={setEmail} />
      <TextInput
        placeholder='Password'
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button icon='login-variant' mode='contained' onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

export default Login;
