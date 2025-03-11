import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { useContext, useState } from 'react';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const ctx = useContext(KeyContext);
  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? null;

  const login = async () => {
    setLoading(true);
    await ctx.authenticate();
    await getBalance();
    setLoading(false);
  }

  const getBalance = async () => {
    try {
      if (!ctx.wallet) return;
      const response = await ctx.wallet.storage.listOutputs({
            basket: '',
            tags: [],
            tagQueryMode: 'any',
            includeLockingScripts: false,
            includeTransactions: false,
            seekPermission: false,
            includeCustomInstructions: false,
            includeTags: false,
            includeLabels: false,
            limit: 0,
            offset: 0,
            knownTxids: [],
      });
      console.log(response);
      const balance = response?.outputs?.reduce((acc, output) => acc + output.satoshis, 0) ?? 0;
      setBalance(balance);
    } catch (error) {
      console.error({ error });
    }
  }

  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#aabbcc' }}
      headerImage={
        <Image
          source={require('@/assets/images/bsv.jpg')}
          style={styles.backgroundImage}
          />}
          >
      {loading ? <ThemedText type="default">Loading...</ThemedText> :
      <>
        {
        identityKey 
          ? <ThemedView style={styles.stepContainer}>
              <ThemedText type="title">Balance</ThemedText>
              <ThemedText type="subtitle">{balance.toLocaleString()}</ThemedText>
              <ThemedButton onPress={ctx.logout} title="Log Out" />
            </ThemedView>
          : <ThemedButton onPress={login} title="Authenticate" />
        }
      </>
      }
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
