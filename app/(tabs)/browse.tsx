import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useColorScheme } from '@/hooks/useColorScheme';
import Browser from '@/wallet/Browser';
import { Image, StyleSheet } from 'react-native';

export default function BrowseScreen() {
  const colorScheme = useColorScheme();

  return (
    <ParallaxScrollView 
    headerBackgroundColor={{ light: '#D0D0D0', dark: '#aabbcc' }}
    headerImage={
      <Image
        source={require('@/assets/images/bsv.jpg')}
        style={styles.backgroundImage}
        />}
    >
      <Browser />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  browserContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  backgroundImage: {
    height: 300,
    width: '100%',
  }
});
