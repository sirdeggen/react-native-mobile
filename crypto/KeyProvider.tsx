import { PrivateKey, KeyDeriver } from '@bsv/sdk';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import 'react-native-get-random-values';
import { createContext, useMemo, useState } from 'react';
import { WalletStorageManager, Wallet, StorageClient, Services } from '@bsv/wallet-toolbox-client';

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
    wallet: Wallet | null;
    storage: WalletStorageManager | null;
    authenticate: () => Promise<void>;
    logout: () => Promise<void>;
}

export const KeyContext = createContext<KeyContextType>({
    wallet: null,
    storage: null,
    authenticate: async () => {},
    logout: async () => {},
});

export default function KeyProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [storage, setStorage] = useState<WalletStorageManager | null>(null);

    async function authenticate() {
        try {
            let key
            // Try to retrieve the stored key with biometric authentication.
            const hexKey = await SecureDataStore.getItem('key');
            if (hexKey) {
                key = PrivateKey.fromHex(hexKey)
            } else {
                // Generate and store a new key with biometric access control.
                key = PrivateKey.fromRandom();
                await SecureDataStore.storeItem('key', key.toHex());
            }

            const chain = 'main'
            const endpointUrl = 'https://store.txs.systems'
            const rootKey = key
            const keyDeriver = new KeyDeriver(rootKey)
            const identityKey = keyDeriver.identityKey
            const storage = new WalletStorageManager(identityKey)
            const services = new Services(chain)
            const wallet = new Wallet({
                chain,
                keyDeriver,
                storage,
                services,
                privilegedKeyManager: undefined,
            })
            const client = new StorageClient(wallet, endpointUrl)
            await storage.addWalletStorageProvider(client)
            await storage.makeAvailable()

            setWallet(wallet)
            setStorage(storage)
        } catch (error) {
            console.log({ error });
        }
    }

    const logout = async () => {
        try {
            await SecureDataStore.deleteItem('key');
            setWallet(null)
            setStorage(null)
        } catch (error) {
            console.log({ error });
        }
    }

    const value = useMemo(() => ({ wallet, storage, authenticate, logout }), [wallet, storage]);

    return <KeyContext.Provider value={value}>{children}</KeyContext.Provider>;
}