import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';

let stompClient = null;

export const connectToWebSocket = (onMessageReceived, jwtToken) => {
    console.log(jwtToken);
    
    const socket = new SockJS('http://localhost:5454/ws'); 
    const client = new Client({
        webSocketFactory: () => socket, 
        connectHeaders: {
            Authorization: `Bearer ${jwtToken}`,
        },
        debug: (str) => {
            console.log(str);
        },
        onConnect: () => {
            console.log('Connected to WebSocket:');
            client.subscribe('/topic/messages', (message) => {
                if (message.body) {
                    console.log('message recieved');
                    
                    onMessageReceived(JSON.parse(message.body));
                }
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error:', frame.headers['message']);
            console.error('Additional details:', frame.body);
        },
        reconnectDelay: 5000, // Attempt reconnection after 5 seconds
    });

    stompClient = client;
    console.log('Activating WebSocket client...',stompClient);
    client.activate();
};


export const sendMessage = (message) => {
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
    } else {
        console.error("WebSocket is not connected. Cannot send message.");
    }
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log('Disconnected from WebSocket');
    }
};



