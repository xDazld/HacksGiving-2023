import express from "express"
const app = new express();
const clients = [];

clients.push({
    id:0,
    userInput:"Hello world",
    generatedResponse:"bruh cringe"
});
clients.push({
    id:1,
    userInput:"world hello",
    generatedResponse:""
});

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

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});