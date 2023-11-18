// JavaScript to handle form submission
window.onload = () => {
    document.getElementById("customForm").onsubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get all questions and their selected answers
        const form = event.target;
        const formData = new FormData(form);
        const jsonData = {};

        for (const [key, value] of formData.entries()) {
            jsonData[key] = value;
        }

        sessionStorage.setItem("InitialQueryAnswers", JSON.stringify(jsonData));
        form.reset();
        location.replace("hacksgiving/chatPage.html");
    };
};
