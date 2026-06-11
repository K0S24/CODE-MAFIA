import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL);
  }
  return socketInstance;
}

export function useSocket(eventHandlers) {
  const socket = getSocket();
  const handlersRef = useRef(eventHandlers);
  handlersRef.current = eventHandlers;

  useEffect(() => {
    // Register stable wrappers that dereference the CURRENT handler at call
    // time — otherwise every handler would be a stale closure from the
    // first render (the event names must not change between renders).
    const wrappers = Object.keys(handlersRef.current).map((event) => {
      const wrapper = (...args) => handlersRef.current[event]?.(...args);
      socket.on(event, wrapper);
      return [event, wrapper];
    });
    return () => {
      wrappers.forEach(([event, wrapper]) => socket.off(event, wrapper));
    };
  }, [socket]);

  return socket;
}
