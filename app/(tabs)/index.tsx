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
  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? null;
  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#aabbcc' }}
      headerImage={
        <Image
          source={require('@/assets/images/bsv.jpg')}
          style={styles.backgroundImage}
          />}
          >
      {identityKey 
        ? 
        <ThemedView style={styles.stepContainer}>
          <QRCode
            value={identityKey}
            size={320}
          />
          <ThemedText type="default">{identityKey}</ThemedText>
        </ThemedView>
        : <ThemedButton onPress={ctx.authenticate} title="Authenticate" /> }
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
