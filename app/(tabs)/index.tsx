import { Alert, Image, StyleSheet, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import React, { useContext, useState } from 'react';
import { KeyContext } from '@/crypto/KeyProvider';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [keyPasted, setKeyPasted] = useState<string>('');
  const ctx = useContext(KeyContext);
  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? null;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const login = async () => {
    setLoading(true);
    await ctx.authenticate();
    await getBalance();
    setLoading(false);
  }

  const setKey = async (stringKey: string) => {
    setLoading(true);
    await ctx?.addKey(stringKey);
    setLoading(false);
  };

  const getBalance = async () => {
    try {
      if (!ctx.wallet) return;
      const cleared = await ctx.wallet.listActions({
        labels: [],
      });
      console.log(JSON.stringify(cleared, null, 2));
      const response = await ctx.wallet.storage.listOutputs({
            basket: 'default',
            tags: [],
            tagQueryMode: 'any',
            includeLockingScripts: true,
            includeTransactions: false,
            seekPermission: true,
            includeCustomInstructions: true,
            includeTags: true,
            includeLabels: true,
            limit: 1000,
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
       <ThemedView style={styles.stepContainer}>
        {
        identityKey 
          ? <>
              <ThemedText type="title">Balance</ThemedText>
              <ThemedText type="subtitle">{balance.toLocaleString()}</ThemedText>
              <ThemedButton onPress={() => getBalance()} title="Update Balance" />
              <ThemedButton onPress={ctx.logout} title="Log Out" />
            </>
          : 
            <>
              <TextInput
                onChangeText={hex => {
                  if (/^[0-9A-Fa-f]+$/.test(hex) && hex.length === 64)
                    setKeyPasted(hex)
                  else {
                    console.error('Invalid key: must be a 32-byte hexadecimal value.');
                    Alert.alert('Invalid key', 'Must be a 32-byte hexadecimal value.');
                  }
                }}
                style={{
                  backgroundColor,
                  color: textColor, 
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 8,
                  marginVertical: 8,
                }}
                placeholder="7ab10f218f73ed3cee875a47..."
              />
              <ThemedButton 
                onPress={() => {
                const hex = keyPasted.startsWith('0x') ? keyPasted.slice(2) : keyPasted;
                if (/^[0-9A-Fa-f]+$/.test(hex) && hex.length === 64) {
                  setKey(keyPasted);
                } else {
                  console.error('Invalid key: must be a 32-byte hexadecimal value.');
                }
                }}
                title="Set Key"
              />
              <ThemedButton onPress={login} title="Authenticate" />
            </>
        }
        </ThemedView>
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
