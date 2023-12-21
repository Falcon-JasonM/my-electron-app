// Do some things as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
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

    // Handle 'Add Blog Post' button click event
    const addButton = document.getElementById('addPostButton');
    if (addButton) {
        addButton.addEventListener('click', async function (event) {
            event.preventDefault();

            const title = document.getElementById('titleInput').value;
            const content = quill.root.innerHTML;

            if (title && content) {
                await addBlogPost(title, content);
                
            } else {
                console.error('Title or content input is missing.');
            }
        });
    } else {
        console.error('Add Blog Post button element is missing.');
    }

    // Use MutationObserver to watch for changes in the editor content and handle them
    const observer = new MutationObserver(() => {
        const content = quill.root.innerHTML;
        // Maybe we'll do something with the content here later...
        console.log('Content has changed:', content);
    });

    // Configure the observer to watch for changes in Quill's editor content
    const editorContainer = document.querySelector('#editor-container');
    const editorRoot = editorContainer.querySelector('.ql-editor');
    observer.observe(editorRoot, { childList: true, subtree: true });

    getBlogPostsFromLambda();
});

async function addBlogPost(title, content) {
    try {
        const blogPost = { title, content };
        const lambdaPayload = JSON.stringify(blogPost);
        console.log("AWS Lambda payload:", lambdaPayload);

        const response = await fetch('https://tdw5fwrn33.execute-api.us-east-2.amazonaws.com/StoreBlogInputData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: lambdaPayload
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log("addBlogPost Lambda response:", response); // Check the structure of the received data
        // refresh the blog posts
        getBlogPostsFromLambda();
        // Clear the input fields
        document.getElementById('titleInput').value = "";
        document.getElementById('editor-container').firstElementChild.innerHTML = "";
        
    } catch (error) {
        console.error("Error:", error);
    }
}

function getBlogPostsFromLambda() {
    fetch(`https://tdw5fwrn33.execute-api.us-east-2.amazonaws.com/RetrieveBlogPosts?page=1`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
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
        // Clear the blog container
        blogContainer.innerHTML = "";
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

// Handle 'Search' button click event
const searchButton = document.getElementById('searchButton');
if (searchButton) {
    searchButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const searchTerm = document.getElementById('searchInput').value;

        if (isValidSearchTerm(searchTerm)) {
            await searchBlogPosts(searchTerm);
        } else {
            console.error('Search term is invalid.');
        }
    });
} else {
    console.error('Search button element is missing.');
}

// ...

function isValidSearchTerm(searchTerm) {
    // Use a regular expression to validate the search term
    const regex = /^[a-zA-Z0-9() ]+$/;
    return regex.test(searchTerm);
}

async function searchBlogPosts(searchTerm) {
    try {
        if (!isValidSearchTerm(searchTerm)) {
            console.error('Invalid search term.');
            return;
        }

        // You can use the searchTerm to perform a search
        // You might want to send a request to your backend (Java Lambda) to retrieve filtered blog posts
        // Example:
        const response = await fetch(`https://tdw5fwrn33.execute-api.us-east-2.amazonaws.com/RetrieveBlogPosts?searchTerm=${searchTerm}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        populateBlogs(data); // Update the displayed blog posts with the search results
        
    } catch (error) {
        console.error("Error:", error);
    }
}