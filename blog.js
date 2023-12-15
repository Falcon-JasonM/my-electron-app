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
    // Use an array to store the blog posts
    const blogPost = {
        title: title,
        content: content
    };
    blogPosts.push(blogPost);
    // Call a function to update the blog page with the new post
    updateBlogPage();

    // Make an asynchronous call to an AWS Lambda function with the new blog post in JSON format
    const lambdaPayload = JSON.stringify(blogPost);

    fetch(`https://y3vpihpmxktz35sbweou2zfgty0xpsza.lambda-url.us-east-2.on.aws`, {
        method: "POST",
        body: lambdaPayload
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
        console.log("AWS Lambda response: ", data); // Check the structure of the received data

        const blogContainer = document.getElementById("blogContainer");
        if (!blogContainer) {
            throw new Error("Blog container not found in the DOM.");
        }

        // Assuming data is already an array of blog post objects
        data.forEach(blogPost => {
            // Create elements for each blog post
            const newBlogPost = document.createElement("article");
            newBlogPost.classList.add("blog-post");

            const titleElement = document.createElement("h2");
            titleElement.textContent = blogPost.title;

            const contentElement = document.createElement("p");
            contentElement.textContent = blogPost.content;

            newBlogPost.appendChild(titleElement);
            newBlogPost.appendChild(contentElement);

            blogContainer.appendChild(newBlogPost);
        });
    } catch (error) {
        // Handle any errors that occurred during DOM manipulation
        console.error("Error:", error);
    }
}



// Function to post an image
function postImage(imageUrl) {
    // Code to post the image to a server or storage
    // For example, you can use an API to upload the image
    // Here, we are just logging the image URL for demonstration purposes
    console.log("Image posted:", imageUrl);
}

// Function to update the blog page

function getBlogPostsFromLambda() {
    const lambdaFunctionName = "RetrieveBlogPosts";

    fetch(`https://axurjmgnt5woguer2ab4wwsqdu0eifrr.lambda-url.us-east-2.on.aws`, {
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


// // Function to handle the click event of the "Add Blog Post" button
// function handleAddBlogPostClick() {
//     const title = "New Blog Post";
//     const content = "This is the content of the new blog post.";
//     addBlogPost(title, content);
// }

// // Add event listener to the "Add Blog Post" button
// const addBlogPostButton = document.getElementById("addBlogPostButton");
// addBlogPostButton.addEventListener("click", handleAddBlogPostClick);

// // Example usage
// addBlogPost("My First Blog Post", "This is the content of my first blog post.");
// postImage("https://example.com/image.jpg");
