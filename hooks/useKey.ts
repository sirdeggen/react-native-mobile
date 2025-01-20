import { PrivateKey } from '@bsv/sdk';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';

async function storeKeyInSecureEnclave() {
    // check if key is set in secure enclave
    let keyString = await SecureStore.getItemAsync('key');
    if (keyString) {
        return keyString;
    }
    const key = PrivateKey.fromRandom();
    keyString = key.toWif();
     await SecureStore.setItemAsync('key', keyString);
    return keyString;
}

export function useKey(){
    const [key, setKey] = useState<string>('');
    useEffect(() => {
        storeKeyInSecureEnclave().then((key) => {
            setKey(key);
        });
    }, []);
    return key;
}