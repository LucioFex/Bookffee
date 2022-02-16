/* JS Document */
const contactButton = document.getElementById('email');
const copiedEmailMessage = document.getElementById('copied-message');
const descriptionButton = document.getElementById('description-btn');
const bookDescription = document.getElementById('description');

const copyEmailToClipboard = () => {
    /* Function to copy the website's author Email to the clipboard */
    copiedEmailMessage.style.opacity = '100%';
    contactButton.removeEventListener('click', copyEmailToClipboard, false);

    setTimeout(() => { // Time to copy the Email again
        copiedEmailMessage.style.opacity = '0%';
        contactButton.addEventListener('click', copyEmailToClipboard, false);
    }, 3500);

    navigator.clipboard.writeText('luciano1d2esteban@gmail.com');
};

const showDescription = () => {
    /* In the book's description page, there are two types of description:
    [The Lite]: A reduced version (Read More button shows the Full).
    [The Full]: A complete version (Read Less button shows the Lite). */
    const oldDescription = bookDescription.innerHTML;
    const newDescription = descriptionButton.value;
    bookDescription.innerHTML = newDescription;

    // Now the 'Read More' button gets into 'Read Less' (or vice versa)
    let buttonText = descriptionButton.textContent;
    buttonText = buttonText === 'Read More' ? 'Read Less' : 'Read More';

    descriptionButton.textContent = buttonText;
    descriptionButton.value = oldDescription;
};

const setUp = () => {
    /* Function to execute before the DOM is loaded */
    contactButton.addEventListener('click', copyEmailToClipboard, false);
    descriptionButton.addEventListener('click', showDescription, false);
};

// Waits for the DOM to start the script
window.addEventListener('load', setUp, false);
