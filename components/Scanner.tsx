import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, Button, TextInput } from 'react-native';
import { Camera, PermissionStatus, CameraView, BarcodeScanningResult } from 'expo-camera';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { KeyContext } from '@/crypto/KeyProvider';
import { Random, Utils } from '@bsv/sdk';

const Scanner: React.FC = () => {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const [paymentAmount, setPaymentAmount] = useState<string>('');

    const ctx = useContext(KeyContext);
    const identityKey = ctx?.wallet?.keyDeriver?.identityKey || 'not yet authenticated';

    const makePayment = async (address: string, amount: number) => {
        try {
            const w = ctx.wallet;
            if (!w) {
                throw new Error('Wallet not initialized');
            }
            console.log(`Sending ${amount} satoshis to ${address}`);
            const prefix = Utils.toBase64(Random(4));
            const suffix = Utils.toBase64(Random(4));
            // getPubkey for output
            const paymentOutput = await w.getPublicKey({
                protocolID: [2, '3241645161d8'],
                counterparty: scannedData as string,
                keyID: prefix + ' ' + suffix,
            });
            // getInputs and pubkeyForChange
            const change = w.getClientChangeKeyPair();
            const utxos = await w.listOutputs({
                basket: 'default',
                include: 'entire transactions',
                includeCustomInstructions: true,
            })
            console.log({ paymentOutput, change, utxos });
            const createActionRes = ctx.wallet?.createAction({
                description: 'mobile p2p payment',
                inputs: [],
                outputs: [{
                    lockingScript: '',
                    satoshis: amount,
                    outputDescription: 'the funds',
                    customInstructions: JSON.stringify({
                        counterparty: w.identityKey,
                        prefix,
                        suffix,
                    })
                }],
                options: {
                    randomizeOutputs: false,
                    acceptDelayedBroadcast: false,
                }
            });
            console.log({ createActionRes });
        } catch (error) {
            console.error('Payment failed', error);
            Alert.alert('Payment failed', 'Please try again later.');
        }
    };
    

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === PermissionStatus.GRANTED);
            if (status !== PermissionStatus.GRANTED) {
                Alert.alert(
                    'Camera Permission Denied',
                    'Please enable camera access in Settings to use the scanner.'
                );
            }
        })();
    }, []);

    const handleBarCodeScanned = (data: string) => {
        if (!scannedData) {
            setScannedData(data);
            console.log(`Scanned: ${data}`);
        }
    };

    if (hasPermission === null) {
        return <Text>Loading...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No camera access granted.</Text>;
    }

    if (scannedData) return <ThemedView style={styles.stepContainer}>
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
                        makePayment(scannedData, amountNumber);
                    }
                }}
            />
        </>
    </ThemedView>;

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                onBarcodeScanned={({ data } : BarcodeScanningResult) => handleBarCodeScanned(data)}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300
    },
    camera: {
        flex: 1,
    },
    preview: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      stepContainer: {
        gap: 8,
        marginBottom: 8,
      },
});

export default Scanner;
