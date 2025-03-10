import { Image, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { useContext } from 'react';
import { KeyContext } from '@/crypto/KeyProvider';
import QRCode from 'react-native-qrcode-svg';
import { StorageClient } from '@bsv/wallet-toolbox-client';

async function getOutputs (client: StorageClient, identityKey: string) {
  const outputs = await client.listOutputs({ identityKey }, {
    basket: '',
    tags: [],
    tagQueryMode: 'any',
    includeLockingScripts: true,
    includeTransactions: true,
    includeCustomInstructions: true,
    includeTags: true,
    includeLabels: true,
    limit: 0,
    offset: 0,
    seekPermission: false,
    knownTxids: [],
  });
  console.log({ outputs })
}

export default function HomeScreen() {
  const ctx = useContext(KeyContext);
  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? 'not yet authenticated';
  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#aabbcc' }}
      headerImage={
        <Image
          source={require('@/assets/images/bsv.jpg')}
          style={styles.backgroundImage}
          />}
          >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedButton onPress={ctx.authenticate} style={{ color: '#fff' }}>Authenticate</ThemedButton>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{identityKey}</ThemedText>
        <QRCode
          value={identityKey}
          size={200}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
