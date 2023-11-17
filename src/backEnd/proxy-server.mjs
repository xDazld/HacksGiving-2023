import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8096;

const clients = [];

app.use(express.static("../frontEnd", { index: "index.html" }));

app.get("/getResponseRequests", (request, response) => {
    for (let i = 0; i < clients.length; i++) {
        if (!clients[i].generatedResponse) {
            response.status(200);
            response.json({
                id: clients[i].id,
                userInput: clients[i].userInput,
                generatedResponse: clients[i].generatedResponse,
            });
            return;
        }
    }
    response.status(200);
    response.send("No available pending client responses");
});

app.post("/postGeneratedResponse", (request, response) => {
    let responseBody = request.body;
    let id = responseBody.id;
    let generatedResponse = responseBody.generatedResponse;
    for (let i = 0; i < clients; i++) {
        if (clients[i].id === id) {
            clients[i].generatedResponse = generatedResponse;
            clients[i].emit("generatedResponseReady", clients[i].generatedResponse);
            response.status(200);
            return;
        }
    }
    response.status(200);
});

io.on("connection", (socket) => {
    console.log("a user connected");
    let index = clients.length;
    socket.userInput = "";
    socket.generatedResponse = "";
    socket.on("inputMessage", (msg) => {
        socket.userInput = msg;
        console.log("message: " + msg);
    });
    socket.on("disconnect", () => {
        let index = clients.findIndex((socketObj) => {
            return socketObj.id === socket.id;
        });
        clients.splice(index, 1);
        console.log("user disconnected");
        console.log(clients.length);
    });
    clients.push(socket);
    console.log(clients.length);
});

server.listen(port, () => {
    console.log(`listening on Http://localhost:${port}`);
});
