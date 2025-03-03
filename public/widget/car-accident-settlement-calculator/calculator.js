(function() {
    // Get referrer from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('referrer');
    
    // Send to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'cas_calculator_widget_usage', {
            'event_category': 'cas_calculator_widget',
            'event_action': 'chat_initiated',
            'event_label': referrer,
            'widget_type': 'cas_calculator',
            'referrer': referrer || 'direct'
        });
    }

    function initializeChat() {
        const sendButton = document.getElementById('cas-calculator-send');
        const chatInput = document.getElementById('cas-calculator-input');
        const chatMessages = document.getElementById('cas-calculator-messages');

        if (!sendButton || !chatInput || !chatMessages) {
            setTimeout(initializeChat, 500);
            return;
        }

        function handleMessage() {
            const message = chatInput.value.trim();
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.className = 'cas-calculator-message';
                messageElement.textContent = message;
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Track only first message per session
                if (!window.hasUserEngaged && typeof gtag === 'function') {
                    window.hasUserEngaged = true;
                    gtag('event', 'cas_calculator_first_interaction', {
                        'event_category': 'cas_calculator_widget',
                        'event_action': 'first_message_sent',
                        'widget_type': 'cas_calculator',
                        'referrer': referrer || 'direct'
                    });
                }
            }
        }

        // Add event listeners
        sendButton.addEventListener('click', handleMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMessage();
            }
        });
    }

    // Try to initialize immediately
    initializeChat();
})();