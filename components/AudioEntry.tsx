import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const AudioEntry: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0); // New state variable for seconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // New state variable for playing audio

  const handleTitleChange = (text: string) => {
    if (text.length <= 100) {
      setTitle(text);
    }
  };

  const handleSecondsChange = (text: string) => {
    const parsedSeconds = parseInt(text, 10);
    if (!isNaN(parsedSeconds)) {
      setSeconds(parsedSeconds);
    }
  };

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => setCounter(counter - 1);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        
        setRecording(recording);
      } else {
        console.log('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
        setIsRecordingComplete(true); // Set flag indicating recording is complete
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playAudio = async () => {
    try {
      if (audioUri && !isPlaying) { // Check if there is a valid recording and not already playing
        console.log("Playing sound")
        setIsPlaying(true); // Set flag indicating audio is being played
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);
        await sound.playAsync();
        console.log("Done Playing sound")
        setIsPlaying(false); // Reset the flag after audio playback is complete
      }
    } catch (err) {
      console.error('Failed to play audio', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Title:</Text>
        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={handleTitleChange}
          maxLength={100}
        />
        <Text>{100 - title.length} characters remaining</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text>Seconds:</Text>
        <TextInput
          style={styles.textInput}
          value={seconds.toString()}
          onChangeText={handleSecondsChange}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.counterContainer}>
        <Button title="-" onPress={decrementCounter} />
        <Text>{counter}</Text>
        <Button title="+" onPress={incrementCounter} />
      </View>

      <View style={styles.audioContainer}>
        <Button
          title="Start Recording"
          onPress={startRecording}
          disabled={recording !== null} // Disable the button when recording is in progress
        />
        <Button
          title="Stop Recording"
          onPress={stopRecording}
          disabled={recording === null} // Disable the button when recording is not in progress
        />
        <Button title="Play Audio"
          onPress={playAudio}
          disabled={!isRecordingComplete || audioUri == null || isPlaying} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '100%',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AudioEntry;
