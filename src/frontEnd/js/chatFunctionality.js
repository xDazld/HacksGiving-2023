const socket = io();

const sendMessage = () => {
    const message = document.getElementById("userInput").value;
    socket.emit("inputMessage", message);
    document.getElementById("userInput").value = "";
    document.getElementById("chatArea").innerHTML += `<div class='userMessage'>${message}</div>`;
}

window.onload = () => {
    document.getElementById("sendButton").onclick = sendMessage;
}
