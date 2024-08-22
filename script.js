document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messagesContainer');
    const userInput = document.getElementById('userInput');
    const imageInput = document.getElementById('imageInput');
    const sendBtn = document.getElementById('sendBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const userSwitcher = document.getElementById('userSwitcher');
    const cameraBtn = document.getElementById('cameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const videoElement = document.getElementById('videoElement');
    const typingIndicator = document.createElement('div');

    typingIndicator.className = 'typing-indicator';
    typingIndicator.textContent = 'Chatbot is typing...';
    messagesContainer.appendChild(typingIndicator);

    let isDarkMode = false;
    let chatHistories = {
        'User1': [],
        'User2': [],
        'User3': []
    };
    let currentUser = 'User1';
    let stream;

    // Function to add a message to the chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = content;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        messageDiv.appendChild(timestamp);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message in chat history
        chatHistories[currentUser].push(messageDiv.outerHTML);
        saveChatHistory();
    }

    // Load chat history for the current user
    function loadChatHistory(user) {
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(typingIndicator);

        chatHistories[user].forEach(messageHTML => {
            messagesContainer.innerHTML += messageHTML;
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Save chat history to localStorage
    function saveChatHistory() {
        localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    }

    // Load chat history from localStorage on page load
    function loadChatHistoriesFromLocalStorage() {
        const storedHistories = localStorage.getItem('chatHistories');
        if (storedHistories) {
            chatHistories = JSON.parse(storedHistories);
            loadChatHistory(currentUser);
        }
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
    });

    // Get bot response
    function getBotResponse(userText) {
        userText = userText.toLowerCase();
        if (userText.includes('hello') || userText.includes('hi')) {
            return 'Hello! How can I assist you today?';
        } else if (userText.includes('how are you')) {
            return 'I\'m just a bot, but I\'m doing great! How about you?';
        } else if (userText.includes('image')) {
            return 'You can upload an image using the upload button or capture it with your camera!';
        } else if (userText.includes('bye')) {
            return 'Goodbye! Have a wonderful day!';
        } else if (userText.includes('weather')) {
            return 'I can\'t check the weather right now, but you can use a weather app for that!';
        } else if (userText.includes('joke')) {
            return 'Why did the scarecrow win an award? Because he was outstanding in his field!';
        } else {
            return 'I\'m not sure how to respond to that. Can you ask something else?';
        }
    }

    // Send message
    sendBtn.addEventListener('click', function() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            userInput.value = '';

            // Simulate chatbot typing
            typingIndicator.style.display = 'block';
            setTimeout(function() {
                const botResponse = getBotResponse(userMessage);
                addMessage(botResponse, 'bot');
                typingIndicator.style.display = 'none';
            }, 1000);
        }
    });

    // Upload image
    uploadBtn.addEventListener('click', function() {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.className = 'message user';
                imgElement.style.maxWidth = '100%';
                messagesContainer.appendChild(imgElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                // Store message in chat history
                chatHistories[currentUser].push(imgElement.outerHTML);
                saveChatHistory();
            };
            reader.readAsDataURL(file);
        }
    });

    // Switch user
    userSwitcher.addEventListener('change', function() {
        currentUser = userSwitcher.value;
        loadChatHistory(currentUser);
    });

    // Clear chat
    clearChatBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the chat?')) {
            chatHistories[currentUser] = [];
            saveChatHistory();
            loadChatHistory(currentUser);
        }
    });

    // Access the user's camera
    cameraBtn.addEventListener('click', function() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream;
                videoElement.srcObject = mediaStream;
                videoElement.style.display = 'block';
                captureBtn.style.display = 'inline-block';
                cameraBtn.style.display = 'none';
            })
            .catch(function(err) {
                console.error('Error accessing the camera:', err);
                alert('Error accessing the camera. Please check your permissions.');
            });
    });

    // Capture image from the video feed
    captureBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/png');
        stream.getTracks().forEach(track => track.stop());
        videoElement.style.display = 'none';
        captureBtn.style.display = 'none';
        cameraBtn.style.display = 'inline-block';

        addMessage('User captured an image:', 'user');
        const imgElement = document.createElement('img');
        imgElement.src = imageDataUrl;
        imgElement.className = 'captured-image';
        messagesContainer.appendChild(imgElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        chatHistories[currentUser].push(imgElement.outerHTML);
        saveChatHistory();
    });

    // Load chat histories on page load
    loadChatHistoriesFromLocalStorage();
});
