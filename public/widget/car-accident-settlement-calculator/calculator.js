function initializeChat(url) {
    // Log the URL to the console (or send it to your analytics)
    console.log('Chat widget loaded on:', url);

    // Example: Send the URL to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'widget_usage', {
            'event_category': 'Chat Widget',
            'event_label': url
        });
    }

    // Add chat functionality
    document.addEventListener('DOMContentLoaded', function() {
        const sendButton = document.getElementById('send-button');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        sendButton.addEventListener('click', function() {
            const message = chatInput.value;
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.className = 'chat-message';
                messageElement.textContent = message;
                chatMessages.appendChild(messageElement);
                chatInput.value = ''; // Clear input
            }
        });
    });
}