import { View, Image, StyleSheet, Alert, Button, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Scanner from '@/components/Scanner';
import React, { useState, useContext } from 'react';
import { KeyContext } from '@/wallet/KeyProvider';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabTwoScreen() {    
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const ctx = useContext(KeyContext);
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

  const identityKey = ctx?.wallet?.keyDeriver?.identityKey ?? null;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
         <Image
            source={require('@/assets/images/up.jpg')}
            style={styles.backgroundImage}
         />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Send Payment</ThemedText>
      </ThemedView>
      {identityKey 
        ? 
        <View style={{ height: '50%', width: '100%' }}>
          {scannedData ? <>
                  <ThemedText type="subtitle">{scannedData}</ThemedText>
                  <Button title="Clear & Scan Another" onPress={() => setScannedData(null)} />
                  <ThemedText type="subtitle">Pay</ThemedText>
                  <>
                      <ThemedText type="default">Amount in Satoshis:</ThemedText>
                      <TextInput
                          value={paymentAmount}
                          onChangeText={text => {
                              const cleaned = text.replace(/\D/g, '');
                              setPaymentAmount(cleaned);
                          }}
                          keyboardType="numeric"
                          placeholder="1000"
                          style={{
                            backgroundColor,
                            color: textColor, 
                            borderColor: '#ccc',
                            borderWidth: 1,
                            padding: 8,
                            marginVertical: 8,
                          }}
                      />
                      <Button
                          title="Submit Payment"
                          onPress={() => {
                              const amountNumber = parseInt(paymentAmount, 10);
                              if (!paymentAmount || isNaN(amountNumber) || amountNumber <= 0) {
                                  Alert.alert('Invalid amount', 'Please enter a positive integer.');
                              } else if (amountNumber > 2100000000000000) {
                                  Alert.alert('Amount too high', 'Maximum allowed amount is 2100000000000000.');
                              } else {
                                  ctx.makePayment(scannedData, amountNumber);
                              }
                          }}
                      />
                  </>
              </> : 
          <Scanner setScannedData={setScannedData} />}
        </View>
        : <ThemedText type="default">Please authenticate</ThemedText> }
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
