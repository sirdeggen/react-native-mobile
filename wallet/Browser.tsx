import React, { useCallback, useRef } from 'react';
import { Button, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useKeyContext } from './KeyProvider';


export default function Browser() {
  const webviewRef = useRef<WebView>(null);
  const { wallet } = useKeyContext()
  // const xdm = new XDM('https://my-native-app-bsv.atx.systems')

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
        onPress={() => {
          try {
            webviewRef.current?.postMessage(
              JSON.stringify({ type: 'HELLO', payload: 'Hi from native' })
            )
            console.log('Message sent to webview')
          } catch (error) {
            console.error({ error })
          }
        }}
      />
    </View>
  );
}