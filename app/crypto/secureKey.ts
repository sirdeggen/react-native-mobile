import { PrivateKey } from '@bsv/sdk';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import 'react-native-get-random-values';

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

    static async hasItem(key: string): Promise<boolean> {
        return await SecureStore.getItemAsync(key) !== null;
    }
}

export default async function getKey(): Promise<PrivateKey> {
    // Try to retrieve the stored key with biometric authentication.
    const credentials = await SecureDataStore.getItem('key');
    if (credentials) {
        return PrivateKey.fromWif(credentials);
    } else {
        // Generate and store a new key with biometric access control.
        const newKey = PrivateKey.fromRandom();
        await SecureDataStore.storeItem('key', newKey.toWif());
        return newKey;
    }
}
