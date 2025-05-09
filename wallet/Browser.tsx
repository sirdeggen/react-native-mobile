import { ThemedText } from '@/components/ThemedText';
import React, { useCallback, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { useKeyContext } from './KeyProvider';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    height: 50
  },
  urlBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  urlInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  disabledButton: {
    backgroundColor: '#eee',
    opacity: 0.5,
  },
  goButton: {
    height: 36,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 4,
    backgroundColor: '#4285F4',
  },
  goButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingBar: {
    height: 3,
    backgroundColor: '#eee',
    width: '100%',
  },
  loadingIndicator: {
    height: '100%',
    width: '20%',
    backgroundColor: '#4285F4',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 12,
  }
});

export default function Browser() {
  const webviewRef = useRef<WebView>(null);
  const { wallet } = useKeyContext();
  const [lastMessage, setLastMessage] = useState<string>('');
  
  // URL and navigation state
  const [url, setUrl] = useState<string>('https://metanet.bsvb.tech');
  const [currentUrl, setCurrentUrl] = useState<string>('https://metanet.bsvb.tech');
  const [inputUrl, setInputUrl] = useState<string>('https://metanet.bsvb.tech');
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize XDM with the native app URL as the origin
  // const xdm = useRef(new XDM('bsv-wallet://app'));

  // State to track console logs from WebView
  const [consoleLogs, setConsoleLogs] = useState<Array<{method: string, args: string[], timestamp: number}>>([]);

  // Handle WebView messages
  const handleMessage = useCallback(async (event: WebViewMessageEvent) => {
    let msg
    try {
      msg = JSON.parse(event.nativeEvent.data);
      
      // Handle console logs from the WebView
      if (msg.type === 'CONSOLE') {
        const newLog = {
          method: msg.method,
          args: msg.args,
          timestamp: Date.now()
        };
        
        // Log to React Native console with appropriate method
        switch (msg.method) {
          case 'log':
            console.log('[WebView]', ...msg.args);
            break;
          case 'warn':
            console.warn('[WebView]', ...msg.args);
            break;
          case 'error':
            console.error('[WebView]', ...msg.args);
            break;
          case 'info':
            console.info('[WebView]', ...msg.args);
            break;
          case 'debug':
            console.debug('[WebView]', ...msg.args);
            break;
        }
        
        // Keep the last 50 logs
        setConsoleLogs(prevLogs => [
          newLog,
          ...prevLogs.slice(0, 49)
        ]);
        
        // Also update the last message display
        setLastMessage(`[WebView ${msg.method}]: ${msg.args.join(' ')}`);
        return;
      }
      
      // Handle API calls
      console.log(msg.call, msg.args);
      setLastMessage(JSON.stringify(msg));

      let response: any;
      switch(msg.call) {
        case 'getPublicKey':
          response = await wallet?.getPublicKey(msg?.args || {})
          break;
        case 'revealCounterpartyKeyLinkage':
          response = await wallet?.revealCounterpartyKeyLinkage(msg?.args || {})
          break;
        case 'revealSpecificKeyLinkage':
          response = await wallet?.revealSpecificKeyLinkage(msg?.args || {})
          break;
        case 'encrypt':
          response = await wallet?.encrypt(msg?.args || {})
          break;
        case 'decrypt':
          response = await wallet?.decrypt(msg?.args || {})
          break;
        case 'createHmac':
          response = await wallet?.createHmac(msg?.args || {})
          break;
        case 'verifyHmac':
          response = await wallet?.verifyHmac(msg?.args || {})
          break;
        case 'createSignature':
          response = await wallet?.createSignature(msg?.args || {})
          break;
        case 'verifySignature':
          response = await wallet?.verifySignature(msg?.args || {})
          break;
        case 'createAction':
          response = await wallet?.createAction(msg?.args || {})
          break;
        case 'signAction':
          response = await wallet?.signAction(msg?.args || {})
          break;
        case 'abortAction':
          response = await wallet?.abortAction(msg?.args || {})
          break;
        case 'listActions':
          response = await wallet?.listActions(msg?.args || {})
          break;
        case 'internalizeAction':
          response = await wallet?.internalizeAction(msg?.args || {})
          break;
        case 'listOutputs':
          response = await wallet?.listOutputs(msg?.args || {})
          break;
        case 'relinquishOutput':
          response = await wallet?.relinquishOutput(msg?.args || {})
          break;
        case 'acquireCertificate':
          response = await wallet?.acquireCertificate(msg?.args || {})
          break;
        case 'listCertificates':
          response = await wallet?.listCertificates(msg?.args || {})
          break;
        case 'proveCertificate':
          response = await wallet?.proveCertificate(msg?.args || {})
          break;
        case 'relinquishCertificate':
          response = await wallet?.relinquishCertificate(msg?.args || {})
          break;
        case 'discoverByIdentityKey':
          response = await wallet?.discoverByIdentityKey(msg?.args || {})
          break;
        case 'isAuthenticated':
          response = await wallet?.isAuthenticated({})
          break;
        case 'waitForAuthentication':
          response = await wallet?.waitForAuthentication({})
          break;
        case 'getHeight':
          response = await wallet?.getHeight({})
          break;
        case 'getHeaderForHeight':
          response = await wallet?.getHeaderForHeight(msg?.args || {})
          break;
        case 'getNetwork':
          response = await wallet?.getNetwork({})
          break;
        case 'getVersion':
        default:
          response = await wallet?.getVersion({})
          break;
      }
      sendResponseToWebView(msg.id, response)
    } catch (error) {
      console.error('Error handling WebView message:', error, msg);
    }
  }, [wallet]);

  // Send a message to the WebView
  const sendResponseToWebView = (id: string, result: any) => {
    try {
      if (!webviewRef.current) return;
      
      // Create a message in the format expected by XDM
      const message = {
        type: 'CWI',
        id,
        isInvocation: false,
        result,
        status: 'ok'
      };
      
      // Send the message to the WebView
      webviewRef.current?.postMessage(JSON.stringify(message));
      console.info(message);
    } catch (error) {
      console.error('Error sending message to WebView:', error);
    }
  };

  // JavaScript to inject into the WebView to capture console logs
  const injectedJavaScript = `
    (function() {
      if (window.isLogListenerInjected) return;
      window.isLogListenerInjected = true;
      
      // Create a logs container div that will be attached to the bottom of the page
      const logsContainer = document.createElement('div');
      logsContainer.id = 'console-logs-container';
      logsContainer.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; max-height: 30vh; background-color: rgba(0, 0, 0, 0.8); color: white; font-family: monospace; font-size: 12px; padding: 8px; overflow-y: auto; z-index: 9999; border-top: 1px solid #444;';
      
      // Function to add a log entry to the container
      function addLogToContainer(method, args) {
        const logEntry = document.createElement('div');
        logEntry.style.cssText = 'margin: 2px 0; border-bottom: 1px solid #333; padding-bottom: 2px;';
        
        // Add different styling based on log method
        switch(method) {
          case 'error':
            logEntry.style.color = '#ff5252';
            break;
          case 'warn':
            logEntry.style.color = '#ffab40';
            break;
          case 'info':
            logEntry.style.color = '#2196f3';
            break;
          case 'debug':
            logEntry.style.color = '#69f0ae';
            break;
          default:
            logEntry.style.color = 'white';
        }
        
        // Create timestamp
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const logContent = Array.from(args).map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        logEntry.textContent = \`[\${timestamp}] [\${method.toUpperCase()}]: \${logContent}\`;
        logsContainer.appendChild(logEntry);
        
        // Auto-scroll to the bottom
        logsContainer.scrollTop = logsContainer.scrollHeight;
        
        // Limit the number of log entries to prevent memory issues
        while (logsContainer.children.length > 100) {
          logsContainer.removeChild(logsContainer.firstChild);
        }
      }
      
      // Add the logs container to the DOM when the page is loaded
      if (document.body) {
        document.body.appendChild(logsContainer);
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          document.body.appendChild(logsContainer);
        });
      }
      
      // Store original console methods
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug
      };
      
      // Override console methods to display logs in the container
      console.log = function() {
        originalConsole.log.apply(console, arguments);
        addLogToContainer('log', arguments);
      };
      
      console.warn = function() {
        originalConsole.warn.apply(console, arguments);
        addLogToContainer('warn', arguments);
      };
      
      console.error = function() {
        originalConsole.error.apply(console, arguments);
        addLogToContainer('error', arguments);
      };
      
      console.info = function() {
        originalConsole.info.apply(console, arguments);
        addLogToContainer('info', arguments);
      };
      
      console.debug = function() {
        originalConsole.debug.apply(console, arguments);
        addLogToContainer('debug', arguments);
      };
      
      // Also capture uncaught errors
      window.addEventListener('error', function(e) {
        addLogToContainer('error', ['Uncaught error:', e.message, 'at', e.filename, 'line', e.lineno]);
        return true;
      });
      
      // Create a button to toggle the visibility of the logs container
      const toggleButton = document.createElement('button');
      toggleButton.textContent = 'Toggle Logs';
      toggleButton.style.cssText = 'position: fixed; bottom: 0; right: 0; background-color: #444; color: white; border: none; border-radius: 4px 0 0 0; padding: 4px 8px; font-size: 10px; z-index: 10000; cursor: pointer;';
      toggleButton.addEventListener('click', function() {
        if (logsContainer.style.display === 'none') {
          logsContainer.style.display = 'block';
          toggleButton.textContent = 'Hide Logs';
        } else {
          logsContainer.style.display = 'none';
          toggleButton.textContent = 'Show Logs';
        }
      });
      
      // Add the toggle button to the DOM
      if (document.body) {
        document.body.appendChild(toggleButton);
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          document.body.appendChild(toggleButton);
        });
      }
      
      true; // Note: this is needed to ensure the script is correctly injected
    })();
  `;

  // Handle URL submission
  const handleUrlSubmit = () => {
    let formattedUrl = inputUrl;
    
    // Add http:// if no protocol specified
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      formattedUrl = 'https://' + inputUrl;
      setInputUrl(formattedUrl);
    }
    
    setUrl(formattedUrl);
  };
  
  // Handle navigation state change
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    setInputUrl(navState.url);
    setIsLoading(navState.loading);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer} />
      
      {/* URL input and navigation controls */}
      <View style={styles.urlBarContainer}>
        <TouchableOpacity 
          style={[styles.navButton, !canGoBack && styles.disabledButton]}
          onPress={() => webviewRef.current?.goBack()}
          disabled={!canGoBack}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, !canGoForward && styles.disabledButton]}
          onPress={() => webviewRef.current?.goForward()}
          disabled={!canGoForward}
        >
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => webviewRef.current?.reload()}
        >
          <Text style={styles.navButtonText}>↻</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.urlInput}
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={handleUrlSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          selectTextOnFocus
        />
        
        <TouchableOpacity 
          style={styles.goButton}
          onPress={handleUrlSubmit}
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingBar}>
          <View style={styles.loadingIndicator} />
        </View>
      )}
      
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        originWhitelist={['*']}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // injectedJavaScript={injectedJavaScript}
      />
      
      {lastMessage ? (
        <View style={styles.messageContainer}>
          <ThemedText style={styles.messageText}>Last message: {lastMessage}</ThemedText>
        </View>
      ) : null}
      
      <View style={styles.buttonContainer}>
        <Button
          title="Send HELLO"
          onPress={() => sendResponseToWebView('HELLO', { greeting: 'Hi from BSV wallet app' })}
        />
        
        <Button
          title="Send WALLET_INFO"
          onPress={() => {
            if (wallet) {
              sendResponseToWebView('WALLET_INFO', { 
                isAuthenticated: true,
                capabilities: ['payments', 'authentication']
              });
            }
          }}
        />
      </View>
    </View>
  );
}