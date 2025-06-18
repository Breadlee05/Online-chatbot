// Event listener for send button
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

// Handle button click
sendBtn.addEventListener('click', handleUserInput);

// Also allow sending messages when pressing "Enter"
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});

let userName = '';  // Store user name for personalized responses
let lastResponse = '';  // Keep track of the last bot response

// Function to handle user input
function handleUserInput() {
    const userMessage = userInput.value.trim();
    
    // Check if the input is non-empty
    if (userMessage) {
        displayMessage(userMessage, 'user');
        
        // Process user input and generate a response
        const { response, type } = processUserInput(userMessage);
        
        // If the name is required, validate it
        if (type === 'name-prompt') {
            if (!isValidName(userMessage)) {
                displayMessage("Please provide a valid name (letters and spaces only).", 'bot');
                return; // Stop further processing if the name is invalid
            }
        }
        
        displayMessage(response, 'bot', type);  // Pass type to apply the correct style
        lastResponse = response;
        userInput.value = '';  // Clear input field
    } else {
        displayMessage("Please enter a message.", 'bot');
    }
}

// Function to display messages in chat logs
function displayMessage(message, sender, type = '') {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender} ${type}`;
    messageElement.textContent = message;
    chatlogs.appendChild(messageElement);
    chatlogs.scrollTop = chatlogs.scrollHeight;  // Scroll to latest message
}

// Define the possible command responses
const commandResponses = [
    { pattern: /hello|hi|hey/i, response: () => "Hello! How can I assist you today?", type: 'hello' },
    { pattern: /museum/i, response: () => "We have Bapu Museum and Bhagwan Mahavir Museum. Would you like to know more?", type: 'museum-name' },
    { pattern: /ticket|book/i, response: () => "How many tickets would you like to book?", type: 'ticket-booking' },
    { pattern: /\b\d+\b/, response: (message) => `You want to book ${message.match(/\b\d+\b/)[0]} tickets. Can I have your name?`, type: 'ticket-number' },
    { 
        pattern: /name\s*(is)?\s*([A-Za-z\s]+)/i, 
        response: (message) => {
            const name = message.match(/name\s*(is)?\s*([A-Za-z\s]+)/i);
            if (name && name[2].trim().length > 0) {
                user = name[2].trim();
                return `Thank you. your ticket price for per person ${100}, ${user}. Please enter your email for confirmation.`;
            } else {
                return "Please provide a valid name (letters and spaces only).";
            }
        }, 
        type: 'name-prompt' 
    },
    { pattern: /email/i, response: () => "Please enter your email address for the booking.", type: 'email-prompt' },
    { pattern: /\S+@\S+\.\S+/, response: () => "Great! How would you like to pay? Credit card, debit card, or cash?", type: 'payment-methods' },
    { pattern: /payment|pay|credit card|debit card|cash/i, response: (message) => {
        const method = message.match(/(credit card|debit card|cash)/i)[0];
        return `You've selected to pay by ${method}. Your tickets have been successfully booked!`;
    }, type: 'success' },
    { pattern: /thank you|thanks/i, response: () => "You're welcome! Enjoy your visit!", type: 'thankyou' }
];

// Function to validate if the input is a valid name (letters and spaces only)
function isValidName(name) {
    return /[A-Za-z\s]+$/;
}

// Function to process user input and generate responses
function processUserInput(message) {
    for (const command of commandResponses) {
        if (command.pattern.test(message)) {
            const response = typeof command.response === 'function' ? command.response(message) : command.response;
            return { response, type: command.type };
        }
    }
    return { response: "Sorry, I didn't understand that. Please try again.", type: '' };
}
