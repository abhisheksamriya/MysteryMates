import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();
const PORT = Number(process.env.PORT) || 8081;

const wss = new WebSocketServer({ port: PORT });

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

const allSocket: User[] = [];

function logRoomStatus() {
  const roomCounts: { [key: string]: number } = {};
  allSocket.forEach((user) => {
    roomCounts[user.room] = (roomCounts[user.room] || 0) + 1;
  });
  console.log("room status:", roomCounts);
  console.log("total connected users:", allSocket.length);
}

// Helper function to broadcast to room
function broadcastToRoom(
  room: string,
  message: any,
  excludeSocket?: WebSocket
) {
  let sentCount = 0;
  allSocket.forEach((u, i) => {
    if (u.room === room && u.socket !== excludeSocket) {
      console.log(`sending to user #${i} in room ${room}`);
      u.socket.send(JSON.stringify(message));
      sentCount++;
    }
  });
  console.log(`sent message to ${sentCount} users in room ${room}`);
}

wss.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("message", (e) => {
    const parsedMessage = JSON.parse(e.toString());
    console.log(
      "📨 Received message:",
      parsedMessage.type,
      parsedMessage.payload
    );

    if (parsedMessage.type === "join") {
      const roomId = parsedMessage.payload.roomId;
      const username = parsedMessage.payload.username;
      console.log("user joined room:", roomId, "as", username);

      const existingUserIndex = allSocket.findIndex((u) => u.socket === socket);
      if (existingUserIndex !== -1) {
        allSocket[existingUserIndex].room = roomId;
        allSocket[existingUserIndex].username = username;
        console.log(
          "updated existing user's room and username to:",
          roomId,
          username
        );
      } else {
        allSocket.push({ socket, room: roomId, username });
        console.log("added new user to room:", roomId, "as", username);
      }

      logRoomStatus();

      socket.send(
        JSON.stringify({
          type: "system",
          payload: { message: `You joined room: ${roomId} as ${username}` },
        })
      );

      // Notify others in the room that someone joined
      broadcastToRoom(
        roomId,
        {
          type: "system",
          payload: { message: `${username} joined the room` },
        },
        socket
      );
    }

    if (parsedMessage.type === "chat") {
      console.log("message received:", parsedMessage.payload.message);

      const currentUser = allSocket.find((u) => u.socket === socket);
      if (!currentUser) {
        console.warn("user not found in socket list");
        console.log(
          "current socket list:",
          allSocket.map((u) => ({
            room: u.room,
            username: u.username,
            socketId: u.socket.readyState,
          }))
        );
        logRoomStatus();
        return;
      }

      const room = currentUser.room;
      const author = currentUser.username;
      console.log("broadcasting to room:", room, "from", author);

      broadcastToRoom(room, {
        type: "chat",
        payload: {
          message: parsedMessage.payload.message,
          author,
        },
      });
    }
  });

  socket.on("close", () => {
    console.log("socket disconnected");
    const index = allSocket.findIndex((u) => u.socket === socket);
    if (index !== -1) {
      const user = allSocket[index];
      console.log(`removed user from room: ${user.room} (${user.username})`);

      broadcastToRoom(user.room, {
        type: "system",
        payload: { message: `${user.username} left the room` },
      });

      allSocket.splice(index, 1);
      logRoomStatus();
    }
  });
});
