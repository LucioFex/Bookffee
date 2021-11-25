const btnDelete = document.getElementById("btnDelete");
const formUpdate = document.getElementById("formEdit");


async function myButtonDelete() {
    const myId = btnDelete.dataset.id;

    try {
        const data = await fetch(`/pets/${myId}`, {method: "delete"});
        const res = await data.json();

        if (res.status) {window.location.href = "/pets"}  // Redirect the user
    } catch (error) {
        console.log("YEAH BABY, you have a new error in the family:\n", error);
    }
};

async function myFormUpdate(e) {
    e.preventDefault();

    const id = formUpdate.dataset.id;
    const name = formUpdate.elements["name"].value;
    const description = document.querySelector("#descriptionInput").value;
    // const description = document.getElementById("descriptionInput").value;

    try {
        const data = await fetch(`/pets/${id}`, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, description})  // == body: {name: name, description: description}
        });

        const res = await data.json();
        if (res.status) {window.location.href = "/pets"}  // Redirect the user

    } catch (error) {
        console.log("You made a mistake, wachín:\n", error);
    }
}


try {
    btnDelete.addEventListener("click", myButtonDelete, false);
    formUpdate.addEventListener("submit", myFormUpdate, false);
} catch {}
