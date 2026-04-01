// WebSocket utility functions
export const createWebSocketConnection = (url: string) => {
  const ws = new WebSocket(url);
  
  // Add Socket.io-like interface for easier migration
  const enhancedWs = {
    socket: ws,
    eventHandlers: new Map<string, Set<(data: any) => void>>(),
    
    // Add event listener
    on: function(event: string, callback: (data: any) => void) {
      if (!this.eventHandlers.has(event)) {
        this.eventHandlers.set(event, new Set());
      }
      this.eventHandlers.get(event)?.add(callback);
      return this;
    },
    
    // Remove event listener
    off: function(event: string, callback?: (data: any) => void) {
      if (!callback) {
        this.eventHandlers.delete(event);
      } else if (this.eventHandlers.has(event)) {
        this.eventHandlers.get(event)?.delete(callback);
      }
      return this;
    },
    
    // Emit event
    emit: function(event: string, data: any) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ event, payload: data }));
      }
      return this;
    },
    
    // Close connection
    disconnect: function() {
      this.socket.close();
      return this;
    }
  };
  
  // Handle incoming messages
  ws.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      const { event: eventName, payload } = parsedData;
      
      if (enhancedWs.eventHandlers.has(eventName)) {
        enhancedWs.eventHandlers.get(eventName)?.forEach(callback => {
          callback(payload);
        });
      }
      
      // Handle direct message type (if needed)
      if (parsedData.type === 'message') {
        // Process direct messages that don't follow the event/payload pattern
        console.log('Received direct message:', parsedData);
        // You could emit a custom event here if needed
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  return enhancedWs;
};

export type EnhancedWebSocket = ReturnType<typeof createWebSocketConnection>;

/* 
// Issue 2: WebSocket Message Handling - Notes for implementation
// This is just a comment/note and not executable code
// On the server side, we need to implement message broadcasting:
// if (message.type === 'message') {
//   const recipients = [message.senderId, message.receiverId];
//   recipients.forEach(userId => {
//     const connection = findConnectionForUser(userId);
//     connection?.send(JSON.stringify(message));
//   });
// }
*/


