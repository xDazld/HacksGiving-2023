const socket = io({
    path: "/HacksGiving-2023/socket.io",
});

let loadingSymbol;
let chatArea;

const displayMessage = (message) => {
    loadingSymbol.style.visibility = "hidden";

    chatArea.innerHTML += `<div class='generatedResponse'>${message}</div>`;
};

const sendMessage = () => {
    const message = document.getElementById("userInput").value;
    socket.emit("inputMessage", message);
    loadingSymbol.style.visibility = "visible";
    document.getElementById("userInput").value = "";
    chatArea.innerHTML += `<div class='userMessage'>${message}</div>`;
};

socket.on("generatedResponseReady", displayMessage);

window.onload = () => {
    document.getElementById("sendButton").onclick = sendMessage;
    document.getElementById("userInput").addEventListener("keydown", function (e) {
        if (e.key.toLowerCase() === "enter") {
            sendMessage();
        }
    });

    chatArea = document.getElementById("chatArea");
    loadingSymbol = document.getElementById("LoadingSymbol");
    document.getElementById("navBarTitle").onclick = () => {
        sessionStorage.clear();
        location.replace("/HacksGiving-2023/");
    };
};
