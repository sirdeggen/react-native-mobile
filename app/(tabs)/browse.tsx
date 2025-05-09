import { useColorScheme } from '@/hooks/useColorScheme';
import Browser from '@/wallet/Browser';
import { StyleSheet } from 'react-native';

export default function BrowseScreen() {
  const colorScheme = useColorScheme();

  return (
    <Browser />
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
