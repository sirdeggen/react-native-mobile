import { Image, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import getKey from '@/app/crypto/secureKey';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [display, setDisplay] = useState({ wif: 'ok', address: 'now what' });
    async function displayKey() {
        console.log('displayKey');
        const key = await getKey();
        console.log(key);
        setDisplay({ wif: key.toWif(), address: key.toAddress() });
    }

    useEffect(() => {
        displayKey();
    }, []);

    return <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/bsv-acid.jpeg')}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Local Device Wallet</ThemedText>
        <HelloWave />
      </ThemedView>
      {!!display && <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">SPV First</ThemedText>
        <ThemedText selectable style={{ color: 'white' }}>
          Goose: {display.wif}
        </ThemedText>
        <ThemedText selectable>
          {display.address}
        </ThemedText>
        <QRCode value={display.address} size={150} />
      </ThemedView>}
    </ParallaxScrollView>
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
});
