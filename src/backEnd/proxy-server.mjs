import express from "express"
<<<<<<< HEAD
const app = new express();
const clients = [];
=======
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8096;
>>>>>>> 0465236 (Implement frontend websockets)

app.get("/getResponseRequests", (request, response) => {
    for(let i = 0; i < clients.length; i++){
        if(!clients[i].generatedResponse){
            response.status(200);
            response.json(clients[i]);
            return;
        }
    }
    response.status(200);
    response.send("No available pending client responses");
});

<<<<<<< HEAD
app.post("/postGeneratedResponse", (request, response) => {
    let responseBody = request.body;
    let id = responseBody.id;
    let generatedResponse = responseBody.generatedResponse;
    for(let i = 0; i < clients; i++){
        if(clients[i].id === id){
            clients[i].generatedResponse = generatedResponse;
            // TODO Add the part where the server socket sends the event notifying the browser client of the new generated response
            response.status(200);
            return;
        }
    }
    response.status(200);
});

app.listen(8096, () => {
    console.log("listening on http://localhost:8096");
});
=======
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("inputMessage", (msg) => {
        console.log("message: " + msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`listening on localhost:${port}`);
});
>>>>>>> 0465236 (Implement frontend websockets)
