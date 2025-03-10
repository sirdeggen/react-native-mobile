import { StyleSheet, View, Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Scanner from '@/components/Scanner';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
         <Image
            source={require('@/assets/images/p2p.jpg')}
            style={styles.backgroundImage}
         />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Send Payment</ThemedText>
      </ThemedView>
      <View style={{ height: '50%', width: '100%' }}>
        <Scanner />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  backgroundImage: {
    height: 300,
    width: '100%',
  }
});
