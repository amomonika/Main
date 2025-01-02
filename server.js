const imagesFolder = "images/"; // Path to your image folder
const apiEndpoint = "/get-images"; // Endpoint to fetch the list of image files
const container = document.getElementById("image-container"); // Container for images

// Fetch the list of images from the backend
fetch(apiEndpoint)
  .then(response => response.json())
  .then(images => {
    images.forEach(imageName => {
      const linkUrl = `https://example.com/view/${imageName}`; // Custom link for each image

      const anchor = document.createElement("a");
      anchor.href = linkUrl;

      const img = document.createElement("img");
      img.src = `${imagesFolder}${imageName}`;
      img.alt = imageName;

      anchor.appendChild(img);
      container.appendChild(anchor);
    });
  })
  .catch(error => console.error("Error fetching images:", error));
