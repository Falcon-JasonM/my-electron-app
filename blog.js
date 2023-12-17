document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill
    const quill = new Quill('#editor-container', {
        theme: 'snow' // You can customize the theme if needed
    });

    // Event listener for the Add Blog Post button
    const addButton = document.getElementById('addPostButton');
    addButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the default form submission

        // Get the title and content from the input fields and Quill editor
        const title = document.getElementById('titleInput').value;
        const content = quill.root.innerHTML; // Get HTML content from Quill editor

        addBlogPost(title, content);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    getBlogPostsFromLambda();

    // Event listener for the Add Blog Post button
    const addButton = document.getElementById('addPostButton');
    addButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the default form submission

        // Get the title and content from the input fields
        const title = document.getElementById('titleInput').value;
        const content = document.getElementById('contentInput').value;

        // Call the addBlogPost function with the obtained values
        addBlogPost(title, content);
    });
});

// Function to add a blog post
function addBlogPost(title, content) {
    // Use an object to store the blog post
    const blogPost = {
        title: title,
        content: content
    };
    // Make an asynchronous call to an AWS Lambda function with the new blog post in JSON format
    const lambdaPayload = blogPost;
    console.log("AWS Lambda payload:", lambdaPayload);
    
    fetch(`https://tdw5fwrn33.execute-api.us-east-2.amazonaws.com/StoreBlogInputData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(lambdaPayload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        populateBlogs(data);
        // After successfully adding the post, fetch and display all blog posts again
        getBlogPostsFromLambda();
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error("Error:", error);
    });
}

function populateBlogs(data) {
    try {
        console.log("AWS Lambda response:", data); // Check the structure of the received data

        const blogContainer = document.getElementById("blogContainer");
        if (!blogContainer) {
            throw new Error("Blog container not found in the DOM.");
        }

        // Assuming data is already an array of blog post objects
        data.reverse().forEach(blogPost => {
            // Create elements for each blog post
            const newBlogPost = document.createElement("article");
            newBlogPost.classList.add("blog-post");

            const titleElement = document.createElement("h2");
            titleElement.textContent = blogPost.title;

            const contentElement = document.createElement("div"); // Changed 'p' to 'div' to render Quill content
            contentElement.innerHTML = blogPost.content; // Use innerHTML to render Quill content

            newBlogPost.appendChild(titleElement);
            newBlogPost.appendChild(contentElement);

            blogContainer.appendChild(newBlogPost);
        });
        
    } catch (error) {
        // Handle any errors that occurred during DOM manipulation
        console.error("Error:", error);
    }
}

// Function to update the blog page
function getBlogPostsFromLambda() {
    const lambdaFunctionName = "RetrieveBlogPosts";

    fetch(`https://tdw5fwrn33.execute-api.us-east-2.amazonaws.com/RetrieveBlogPosts`, {
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        populateBlogs(data);
    })
    .catch(error => {
        // Handle any errors that occurred during the request
        console.error("Error:", error);
    });
}