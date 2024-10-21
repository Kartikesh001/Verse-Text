const key = "write your hugging face token here"; // Ensure the key is wrapped in quotes
const inputText = document.getElementById("input"); 
const image = document.getElementById("image"); 
const generatebtn = document.getElementById("btn");
const resetbtn = document.getElementById("reset");
const downloadbtn = document.getElementById("down");

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
            headers: {
                Authorization: `Bearer ${key}` // Use backticks for template literals
            },
            method: "POST",
            body: JSON.stringify({ "inputs": data }), // Pass the actual input data
        }
    );
    const result = await response.blob(); // Return the response as a blob
	image.style.display = "block";
    return result;
}

async function generate() {
    const input = inputText.value; // Get the input text value
    query(input).then((response) => {
        // Use image from the response
        const objUrl = URL.createObjectURL(response);
        image.src = objUrl;
        downloadbtn.addEventListener("click", () => {
            download(objUrl);
        });
        // Set the image source to the generated object URL
    }).catch((error) => {
        console.error("Error:", error); // Error handling
    });
}

// Add click event listener to the generate button
generatebtn.addEventListener("click", () => {
    generate();
});

// Trigger generation on pressing Enter
inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generate();
    }
});

// Reset the input and reload the page
resetbtn.addEventListener("click", () => {
    inputText.value = "";
    window.location.reload();
});

// Download the generated image
function download(objUrl) {
    fetch(objUrl).then(res => res.blob())
    .then(file => {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = `image_${new Date().getTime()}.png`; // Name the downloaded file
        a.click();
    })
    .catch(() => alert("Failed to download"));
}
