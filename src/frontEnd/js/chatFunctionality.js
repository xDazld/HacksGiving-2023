const socket = io({
    path:"/hacksgiving/socket.io"
});

let chatArea;

const displayMessage = (message) =>{
    chatArea.innerHTML += `<div class='generatedResponse'>${message}</div>`;
}

const sendMessage = () => {
    const message = document.getElementById("userInput").value;
    socket.emit("inputMessage", message);
    document.getElementById("userInput").value = "";
    chatArea.innerHTML += `<div class='userMessage'>${message}</div>`;
}

socket.on("generatedResponseReady", displayMessage);

window.onload = () => {
    document.getElementById("sendButton").onclick = sendMessage;
    chatArea = document.getElementById("chatArea");
}
