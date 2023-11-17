const socket = io();

const sendMessage = () => {
    const message = document.getElementById("userInput").value;
    socket.emit("inputMessage", message);
    document.getElementById("userInput").value = "";
}

window.onload = () => {
    document.getElementById("sendButton").onclick = sendMessage;
}
