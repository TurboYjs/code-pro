import { createContext } from "react";
import { Socket, io } from "socket.io-client";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const SOCKET_URL = new URL(serverUrl).origin;

const socket = io(SOCKET_URL, {
    transports: ["websocket"]
});

export const SocketContext = createContext<Socket>( {} as unknown as Socket );

export function SocketProvider({ children } : { children: React.ReactNode }) {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}