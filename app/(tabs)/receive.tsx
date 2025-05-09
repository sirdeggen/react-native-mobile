import { Alert, Clipboard, Image, StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { KeyContext } from '@/wallet/KeyProvider';
import { useContext } from 'react';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
  const ctx = useContext(KeyContext);
  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? null;
  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#aabbcc' }}
      headerImage={
        <Image
          source={require('@/assets/images/down.jpg')}
          style={styles.backgroundImage}
          />}
          >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Receive Payment</ThemedText>
      </ThemedView>
      {identityKey 
        ? 
        <ThemedView style={styles.stepContainer}>
          <TouchableOpacity 
            onPress={() => {
              Clipboard.setString(identityKey);
              Alert.alert('Copied', 'Public key copied to clipboard');
            }}
            activeOpacity={0.7}
          >
            <QRCode
              value={identityKey}
              size={320}
            />
            <ThemedView style={styles.copyHint}>
              <ThemedText style={styles.copyText}>{identityKey}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
        : <ThemedText type="default">Please authenticate</ThemedText> }
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyHint: {
    marginTop: 12,
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  copyText: {
    fontSize: 14,
  },
  copiedContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  backgroundImage: {
    height: 300,
    width: '100%',
  }
});
