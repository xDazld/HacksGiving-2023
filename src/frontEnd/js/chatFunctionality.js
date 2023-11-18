const socket = io({
    path: "/HacksGiving-2023/socket.io",
});

let chatArea;

const displayMessage = (message) => {
    chatArea.innerHTML += `<div class='generatedResponse'>${message}</div>`;
};

const sendMessage = () => {
    const message = document.getElementById("userInput").value;
    socket.emit("inputMessage", message);
    document.getElementById("userInput").value = "";
    chatArea.innerHTML += `<div class='userMessage'>${message}</div>`;
};

socket.on("generatedResponseReady", displayMessage);

window.onload = () => {
    document.getElementById("sendButton").onclick = sendMessage;

    document.getElementById('userInput').addEventListener("keydown",function(e){
        if(e.key.toLowerCase() === "enter"){
            sendMessage();
        } 
    });

    chatArea = document.getElementById("chatArea");
    document.getElementById("navBarTitle").onclick = () => {
        sessionStorage.clear();
        location.replace("/HacksGiving-2023/");
    };
};
