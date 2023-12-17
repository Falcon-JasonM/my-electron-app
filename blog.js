document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            syntax: true, // Enable syntax highlighting module
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  // Headers
                ['bold', 'italic', 'underline'],           // Basic formatting
                ['link', 'image', 'video'],                // Embeds
                [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
                ['code-block'],                            // Code block
                ['clean']                                  // Clear formatting
            ]
        }
    });

    const addButton = document.getElementById('addPostButton');
    addButton.addEventListener('click', function(event) {
        event.preventDefault();

        const title = document.getElementById('titleInput').value;
        const content = quill.root.innerHTML;

        addBlogPost(title, content);
    });

    // Use MutationObserver to watch for changes in the editor content and handle them
    const observer = new MutationObserver(() => {
        const content = quill.root.innerHTML;
        // Do whatever you need with the updated content here
        console.log('Content has changed:', content);
    });

    // Configure the observer to watch for changes in Quill's editor content
    const editorContainer = document.querySelector('#editor-container');
    const editorRoot = editorContainer.querySelector('.ql-editor');
    observer.observe(editorRoot, { childList: true, subtree: true });
});

document.addEventListener('DOMContentLoaded', function() {
    getBlogPostsFromLambda();

    // Event listener for the Add Blog Post button
    const addButton = document.getElementById('addPostButton');
    if (addButton) {
        addButton.addEventListener('click', function(event) {
        event.preventDefault();

        const titleInput = document.getElementById('titleInput');
        const contentInput = document.getElementById('contentInput');

        if (titleInput && contentInput) {
            const title = titleInput.value;
            const content = contentInput.value;

            addBlogPost(title, content);
        } else {
            console.error('Title or content input element is missing.');
        }
    });
} else {
    console.error('Add Blog Post button element is missing.');
}
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