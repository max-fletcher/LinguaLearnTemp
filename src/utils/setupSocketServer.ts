import http from 'http';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { socketAllowedOrigins, socketPort } from '../config/websocket.config';

interface User {
  id: string;
  name: string;
}

interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  broadcastMessageToClient: (user: User, message: string) => void;
}

interface ClientToServerEvents {
  // hello: () => void;
  joinRoom: (roomName: string, user: User) => void;
  leaveRoom: (roomName: string, user: User) => void;
  sendMessageToServer: (roomName: string, message: string) => void;
}

interface InterServerEvents {
  // ping: () => void;
}

interface SocketData {
  // name: string;
  // age: number;
}

const socketIoServerOptions = {
  cors: {
    origin: socketAllowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
};

console.log(socketIoServerOptions);

// Setup the server
const setupSockerServer = (server: http.Server) => {
  const io = new SocketIoServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, socketIoServerOptions);
  // Contains a list of all userIds and their socketIds as key-values
  const userSockets = new Map();

  const disconnect = (client: Socket) => {
    const user = userSockets.get(client.id);
    if (user) {
      userSockets.delete(client.id);
      console.log(`Socket Id - ${client.id!} : User with Id - ${user.id} has disconnected from socket server`);
      console.log('userSockets', userSockets);
    }
    console.log('disconnect client with id', client.id);
  };

  io.on('connection', async (client: Socket) => {
    console.log('A user connected to the socket server');

    const user = client.handshake.auth.user; // runs when a client attempts to connect to the socket and peforms a handshake
    if (user) {
      console.log('handshake', client.handshake.auth, client.handshake.auth.user.id, client.handshake.auth.user.name);

      let alreadyConnected = false;
      for (const [value] of userSockets) {
        if (value.id === user.id) {
          alreadyConnected = true;
          break;
        }
      }

      if (!alreadyConnected) {
        userSockets.set(client.id, user);
        console.log(`Socket Id - ${client.id} assigned to User with Id - ${user.id}`);
      } else {
        console.log(`Duplicate entry for userId - ${user.id} & username - ${user.name}`);
        client.disconnect();
      }
    } else {
      console.log(`User Id not provided. Disconnecting...`);
      client.disconnect();
    }

    console.log('userSockets', userSockets);
    const allConnections = await io.fetchSockets();
    console.log('allConnections', allConnections.length);

    client.on('joinRoom', async (roomName, user) => {
      // To Join a specific room
      await client.join(roomName);
      const sockets = await io.in(roomName).fetchSockets();
      console.log('all sockets', roomName, user, sockets, 'socket count', sockets.length);
    });

    client.on('leaveRoom', async (roomName, user) => {
      // To Join a specific room
      await client.leave(roomName);
      const sockets = await io.in(roomName).fetchSockets();
      console.log('all sockets', roomName, user, sockets, 'socket count', sockets.length);
    });

    client.on('sendMessageToServer', (roomName, message) => {
      console.log('server received msg', roomName, user, message);
      io.to(roomName).emit(
        'broadcastMessageToClient',
        user,
        `User with id ${user.id} says: ${message}`,
      );
    });

    // Doesn't work
    // io.of("/").adapter.on("create-room", (room) => { // On creating room
    //   io.to(room).emit(`User with id {user.id} created room ${room}`);
    // })

    // io.of("/").adapter.on("join-room", (room) => { // On joining room
    //   io.to(room).emit(`User with id {user.id} joined room ${room}`);
    // })

    // io.of("/").adapter.on("leave-room", (room) => { // On joining room
    //   io.to(room).emit(`User with id {user.id} left room ${room}`);
    // })

    client.on('disconnect', () => disconnect(client));
  });

  io.listen(socketPort);
};

export default setupSockerServer;
