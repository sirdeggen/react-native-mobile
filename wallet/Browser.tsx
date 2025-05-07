import { XDM } from '@bsv/sdk';
import React, { useCallback, useRef } from 'react';
import { Button, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useKeyContext } from './KeyProvider';

const xdm = new XDM('https://my-native-app-bsv.atx.systems')

export default function Browser() {
  const webviewRef = useRef<WebView>(null);
  const { wallet } = useKeyContext()

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const msg = JSON.parse(event.nativeEvent.data);
    console.log({ msg })

    // await wallet.isAuthenticated()

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://p2pmnee.atx.systems' }}
        originWhitelist={['*']}
        onMessage={handleMessage}
      />

      <Button
        title="Send HELLO → Web"
        onPress={() =>
          webviewRef.current?.postMessage(
            JSON.stringify({ type: 'HELLO', payload: 'Hi from native' })
          )
        }
      />
    </View>
  );
}