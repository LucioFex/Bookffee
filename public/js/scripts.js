/* JS Document */

const contactButton = document.getElementById("email");
const copiedEmailMessage = document.getElementById("copiedMessage");

const setUp = () => {
    /* Function to execute before the DOM is loaded */
    contactButton.addEventListener("click", copyEmailToClipboard, false);
};

const copyEmailToClipboard = () => {
    /* Function to copy the website's author Email to the clipboard */

    copiedEmailMessage.style.opacity = "100%";
    contactButton.removeEventListener("click", copyEmailToClipboard, false);

    setTimeout(() => {  // Time to copy the Email again
        copiedEmailMessage.style.opacity = "0%";
        contactButton.addEventListener("click", copyEmailToClipboard, false);
    }, 3500);

    navigator.clipboard.writeText("luciano1d2esteban@gmail.com");
};


// Waits for the DOM to start the script
window.addEventListener('load', setUp, false);
