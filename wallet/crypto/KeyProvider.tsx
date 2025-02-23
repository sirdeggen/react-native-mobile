import { PrivateKey } from '@bsv/sdk';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import 'react-native-get-random-values';
import { createContext, useEffect, useMemo, useState } from 'react';

class SecureDataStore {
    /**
     * Stores sensitive data securely using Expo's secure store.
     * @param {string} key - The unique name under which the data is stored.
     * @param {string} value - The sensitive data to store.
     * @returns {Promise<void>} - Resolves when the data is stored.
     */
    static async storeItem(key: string, value: string): Promise<void> {
        await SecureStore.setItemAsync(key, value);
    }

  /**
   * Retrieves sensitive data after successful biometrics authentication.
   * @param {string} key - The name of the data to retrieve.
   * @returns {Promise<string | null>} - The stored data if authentication succeeds, null if the key doesn't exist, or throws an error if authentication fails.
   */
    static async getItem(key: string): Promise<string | null> {
        const authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access sensitive data',
            cancelLabel: 'Cancel',
            disableDeviceFallback: false,
        });

        if (authResult.success) {
            return await SecureStore.getItemAsync(key);
        } else {
            throw new Error('Authentication failed');
        }
    }

    static async deleteItem(key: string): Promise<void> {
        await SecureStore.deleteItemAsync(key);
    }
}

interface KeyContextType {
    key: PrivateKey | null;
    authenticate: () => Promise<void>;
}

export const KeyContext = createContext<KeyContextType>({
    key: null,
    authenticate: async () => {},
});

export default function KeyProvider({ children }: { children: React.ReactNode }) {
    const [key, setKey] = useState<PrivateKey | null>(null);

    async function authenticate() {
        try {
            // Try to retrieve the stored key with biometric authentication.
            const hexKey = await SecureDataStore.getItem('key');
            if (hexKey) {
                setKey(PrivateKey.fromHex(hexKey));
            } else {
                // Generate and store a new key with biometric access control.
                const newKey = PrivateKey.fromRandom();
                await SecureDataStore.storeItem('key', newKey.toHex());
                setKey(newKey);
            }
        } catch (error) {
            console.log({ error });
        }
    }

    const value = useMemo(() => ({ key, authenticate }), [key]);

    return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
}