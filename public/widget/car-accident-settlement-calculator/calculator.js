(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('referrer');
    const API_URL = 'https://cases-vue-app.vercel.app/api/openai-direct';
    
    // System prompt for the AI
    const SYSTEM_PROMPT = `You are an AI assistant helping calculate car accident settlement values. 
    Guide users through providing information about:
    1. Medical bills and expenses (both current and future)
    2. Property damage
    3. Lost wages (both current and future)
    4. Pain and suffering
    
    Be empathetic but focused on gathering accurate information. Ask one question at a time.
    After gathering all necessary information, provide a settlement range estimate with explanation.
    Format responses in HTML for better readability.`;

    // Store message history
    const messageHistory = [];

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

        // Add loading indicator
        function showLoading() {
            const loadingElement = document.createElement('div');
            loadingElement.className = 'cas-calculator-message assistant';
            loadingElement.id = 'loading-message';
            loadingElement.innerHTML = '...';
            chatMessages.appendChild(loadingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return loadingElement;
        }

        function removeLoading(element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }

        async function handleMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message to history and display
            const userMessage = {
                role: 'user',
                content: message
            };
            messageHistory.push(userMessage);
            displayMessage(userMessage);
            
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Disable input while processing
            chatInput.disabled = true;
            sendButton.disabled = true;

            // Show loading indicator
            const loadingElement = showLoading();

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'system',
                                content: SYSTEM_PROMPT
                            },
                            ...messageHistory
                        ]
                    })
                });

                if (!response.ok) throw new Error('API request failed');

                const data = await response.json();
                
                // Remove loading indicator
                removeLoading(loadingElement);

                // Add AI response to history and display
                const assistantMessage = {
                    role: 'assistant',
                    content: data.choices[0].message.content
                };
                messageHistory.push(assistantMessage);
                displayMessage(assistantMessage);

            } catch (error) {
                console.error('Error:', error);
                removeLoading(loadingElement);
                const errorMessage = {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.'
                };
                displayMessage(errorMessage);
            } finally {
                chatInput.disabled = false;
                sendButton.disabled = false;
                chatInput.focus();
            }

            // Track first interaction
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

        function displayMessage(message) {
            const messageElement = document.createElement('div');
            messageElement.className = `cas-calculator-message ${message.role === 'user' ? 'user' : 'assistant'}`;
            messageElement.innerHTML = message.content;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Add event listeners
        sendButton.addEventListener('click', handleMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleMessage();
            }
        });
    }

    // Try to initialize immediately
    initializeChat();
})();