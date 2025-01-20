import { Image, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useKey } from '@/hooks/useKey';
import { PrivateKey } from '@bsv/sdk';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const str = useKey();
  const [key, setKey] = useState(PrivateKey.fromRandom());
  useEffect(() => {
      storeKeyInSecureEnclave().then((key) => {
          setKey(key);
      });
    }, []);
  return (
    <ParallaxScrollView
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
      {!!key && <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">SPV First</ThemedText>
        <ThemedText selectable>
          {key.toWif()}
        </ThemedText>
        <ThemedText selectable>
          {key.toAddress()}
        </ThemedText>
        <QRCode value={key.toAddress()} size={150} />
      </ThemedView>}
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
});
