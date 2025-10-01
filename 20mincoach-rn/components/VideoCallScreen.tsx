// components/VideoCallScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { DailyMediaView } from '@daily-co/react-native-daily-js';
import { useDailyVideoCall } from '../hooks/useDailyVideoCall';
import ControlBar from './ControlBar';
import ParticipantGrid from './ParticipantGrid';

// Define navigation types
export type RootStackParamList = {
  VideoCall: {
    roomUrl: string;
    token?: string;
  };
  // Add other screens here
};

type VideoCallScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VideoCall'
>;

type VideoCallScreenRouteProp = RouteProp<RootStackParamList, 'VideoCall'>;

interface VideoCallScreenProps {
  navigation: VideoCallScreenNavigationProp;
  route: VideoCallScreenRouteProp;
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({ route, navigation }) => {
  const { roomUrl, token } = route.params;
  const {
    callState,
    participants,
    error,
    joinCall,
    leaveCall,
    toggleCamera,
    toggleMicrophone,
    isJoined,
    isJoining,
  } = useDailyVideoCall();

  useEffect(() => {
    joinCall(roomUrl, token);
  }, [roomUrl, token, joinCall]);

  const handleLeaveCall = (): void => {
    leaveCall().catch(console.error);
    navigation.goBack();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLeaveCall}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isJoining) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Joining call...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ParticipantGrid participants={participants} />
      
      <ControlBar
        onLeaveCall={handleLeaveCall}
        onToggleCamera={toggleCamera}
        onToggleMicrophone={toggleMicrophone}
        isJoined={isJoined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VideoCallScreen;