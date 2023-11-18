import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 8096;

const clients = [];

app.use(express.static("../frontEnd", { index: "index.html" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API endpoint to get the next available object that needs to have its data processed.
 * Response gets a JSON with one object representing the first client that needs a response generated.
 */
app.get("/getResponseRequests", (request, response) => {
    
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].userInput && !clients[i].locked) {
            clients[i].locked = true;
            console.log("Compute node has made a request to /getResponseRequests");
            console.log(
                `Server is returning the client with ID:${clients[i].id} user's input data to the Compute node.`,
            );
            response.status(200);
            response.json({
                id: clients[i].id,
                userInput: clients[i].userInput,
            });
            console.log(
                `Client with ID:${clients[i].id} has been locked until the compute node posts a generated response.`,
            );
            return;
        }
    }
    response.sendStatus(418); //I am not a teapot status code which just means that there is no data available right now.
});

/**
 * API endpoint for compute note to post a generated response
 */
app.post("/postGeneratedResponse", (request, response) => {
    let requestBody = request.body;
    let id = requestBody["id"];
    console.log(`Compute node posted data for ID:${id}. Looking for Client with the provided ID.`);
    let generatedResponse = requestBody["generatedResponse"];
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].id == id) {
            console.log(`Socket with correct ID found: ${clients[i].id}`);
            clients[i].emit("generatedResponseReady", generatedResponse);
            clients[i].userInput = "";
            clients[i].locked = false;
            console.log(
                `Client obj with ID:${id} has been unlocked. Client front end updated with the generated response.`,
            );
            response.sendStatus(200);
            return;
        }
    }
    console.log(
        `There were no clients or connected with the ID:${id}.`,
    );
    response.sendStatus(418);
});

io.on("connection", (socket) => {
    console.log("a user connected");
    let index = clients.length;
    socket.userInput = "";
    socket.locked = false;
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
