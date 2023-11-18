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
        location.replace("/HacksGiving-2023/chatPage.html");
    };
    document.getElementById("AcknowledgeAndContinueButton").onclick = acknowledgeUserAgreement;
};

const acknowledgeUserAgreement = async () => {
    if (document.getElementById("AcknowledgeCheckBox").checked === true) {
        document.getElementById("UserInteractionPreventer").className += "disipate";
        setTimeout(() => {
            document.getElementById("UserInteractionPreventer").remove();
        }, 300);
        document.getElementById("AILegalAgreement").remove();
    }
};
