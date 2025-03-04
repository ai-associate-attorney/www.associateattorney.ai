(function() {
    // Get the current webpage URL and encode it
    const currentUrl = window.location.href;
    const scriptBasePath = 'https://www.associateattorney.ai';
    // const scriptBasePath = 'http://localhost:8080'; //'https://www.associateattorney.ai';

    // Encode the URL safely for query parameter
    const encodedUrl = encodeURIComponent(currentUrl);
    
    // Add security measures
    // 1. Remove potentially dangerous characters
    const sanitizedUrl = encodedUrl.replace(/[^\w\-\.\~\:\/?#\[\]@\!\$&'\(\)\*\+,;=]/g, '');
    
    // 2. Limit URL length to prevent overflow attacks (e.g., 2048 chars)
    const truncatedUrl = sanitizedUrl.substring(0, 2048);

    // Load styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = scriptBasePath+'/widget/car-accident-settlement-calculator/style.css';
    document.head.appendChild(link);


    // Create chat interface
    const chatContainer = document.createElement('div');
    chatContainer.id = 'cas-calculator-widget';
    chatContainer.innerHTML = `
        <div class="chat-header">
            <span>Car Accident Settlement Calculator</span>
            <button class="cas-calculator-minimize-btn">−</button>
        </div>
        <div id="cas-calculator-messages" class="chat-messages"></div>
        <div class="chat-input-container">
            <input type="text" id="cas-calculator-input" placeholder="Type a message...">
            <button id="cas-calculator-send">Send</button>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // Add minimize/maximize functionality
    const minimizeButton = chatContainer.querySelector('.cas-calculator-minimize-btn');
    minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        chatContainer.classList.toggle('minimized');
        minimizeButton.textContent = chatContainer.classList.contains('minimized') ? '+' : '−';
    });

    // Expand when clicking on minimized chat
    chatContainer.addEventListener('click', () => {
        if (chatContainer.classList.contains('minimized')) {
            chatContainer.classList.remove('minimized');
            minimizeButton.textContent = '−';
        }
    });

    // Load the calculator script with URL parameter
    const script = document.createElement('script');
    script.src = `${scriptBasePath}/widget/car-accident-settlement-calculator/calculator.js?referrer=${truncatedUrl}`;
    document.body.appendChild(script);
})();


// (function() {
//     // Load styles
//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'mywebsite/path/to/style.css'; // Path to your CSS file
//     document.head.appendChild(link);

//     // Create chat interface
//     const chatContainer = document.createElement('div');
//     chatContainer.id = 'chat-widget';
//     chatContainer.innerHTML = `
//         <div class="chat-header">Chat</div>
//         <div class="chat-messages" id="chat-messages"></div>
//         <input type="text" id="chat-input" placeholder="Type a message...">
//         <button id="send-button">Send</button>
//     `;
//     document.body.appendChild(chatContainer);

//     // Load the logic
//     const script = document.createElement('script');
//     script.src = 'mywebsite/path/to/calculator.js';
//     script.onload = function() {
//         if (typeof initializeChat === 'function') {
//             initializeChat(window.location.href);
//         }
//     };
//     document.body.appendChild(script);
// })();