import express from "express";
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8096;

const clients = [];

app.use(express.static("../frontEnd", {index:"index.html"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getResponseRequests", (request, response) => {
    for(let i = 0; i < clients.length; i++){
        if(!clients[i].generatedResponse){
            response.status(200);
            response.json({
                id:clients[i].id,
                userInput:clients[i].userInput,
                generatedResponse:clients[i].generatedResponse
            });
            return;
        }
    }
    response.status(200);
    response.send("No available pending client responses");
});

app.post("/postGeneratedResponse", (request, response) => {
    let requestBody = request.body;
    let id = requestBody["id"];
    let generatedResponse = requestBody["generatedResponse"];
    for(let i = 0; i < clients.length; i++){
        console.log(clients[i].id);
        if(clients[i].id === id){
            console.log(`Socket with correct ID found: ${clients[i].id}`);
            clients[i].generatedResponse = generatedResponse;
            clients[i].emit("generatedResponseReady", clients[i].generatedResponse);
            response.status(200);
            response.send("Updated frontend");
            return;
        }
    }
    response.status(200);
    response.send("no clients with id found");
    return;
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
        let index = clients.findIndex((socketObj)=>{
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
