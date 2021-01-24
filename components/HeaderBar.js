import React from 'React';
import { Appbar } from 'react-native-paper';

const HeaderBar = ({ navigation, previous }) => (
  <Appbar.Header>
    {previous && <Appbar.BackAction onPress={navigation.goBack} />}
    <Appbar.Content title='Imagigram' />
  </Appbar.Header>
);

export default HeaderBar;
