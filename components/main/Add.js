import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const Add = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraRequest = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraRequest.status === 'granted');
      const galleryRequest = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryRequest.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const discardPicture = () => setImage();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === null) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {image ? (
          <Image source={{ uri: image }} style={{ flex: 1 }} />
        ) : (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={{ flex: 1, aspectRatio: 1 }}
            type={type}
            ratio={'1:1'}
          />
        )}
      </View>
      <Button
        icon='camera-flip-outline'
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      >
        Flip Camera
      </Button>
      {image ? (
        <Button onPress={() => discardPicture()}>Discard Picture</Button>
      ) : (
        <Button icon='camera-plus-outline' onPress={() => takePicture()}>
          Take Picture
        </Button>
      )}
      <Button icon='image-album' onPress={() => pickImage()}>
        Select from the Gallery
      </Button>
      <Button
        icon='content-save-outline'
        onPress={() => navigation.navigate('Save', { image })}
      >
        Save
      </Button>
    </View>
  );
};

export default Add;
