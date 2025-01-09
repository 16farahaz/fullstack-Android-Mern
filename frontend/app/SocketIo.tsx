/* import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import io from 'socket.io-client';

// Make sure to update the URL to match your backend
const socket = io('http://localhost:5000', {
    transports: ['websocket'],  // Ensure WebSocket is used
});

// Listen for the 'pushNotification' event
socket.on('pushNotification', (data: { message: string }) => {
    console.log('New message:', data.message);
});

const sendMessage = (message: string): void => {
    socket.emit('send', { message });
};

const SocketIo: React.FC = () => {
    useEffect(() => {
        // Any setup or cleanup code here, e.g., listening to events, etc.
        return () => {
            socket.off('pushNotification'); // Cleanup on component unmount
        };
    }, []);

    const handleSendMessage = () => {
        const message = 'Hello from React Native!';
        sendMessage(message); // Trigger sendMessage when a button is pressed
    };

    return (
        <View>
            <Text>SocketIo Example</Text>
            <Button title="Send Message" onPress={handleSendMessage} />
        </View>
    );
};

export default SocketIo;
 */