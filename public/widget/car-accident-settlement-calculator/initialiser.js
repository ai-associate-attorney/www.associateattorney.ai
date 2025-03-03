(function() {
    // Get the current webpage URL
    const currentUrl = window.location.href;
    const scriptBasePath = 'https://www.associateattorney.ai'; //'http://localhost:8080'; //'https://www.associateattorney.ai';

    // Load styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = scriptBasePath+'/widget/car-accident-settlement-calculator/style.css';
    document.head.appendChild(link);

    // Create chat interface
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-widget';
    chatContainer.innerHTML = `
        <div class="chat-header">Chat</div>
        <div class="chat-messages" id="chat-messages"></div>
        <input type="text" id="chat-input" placeholder="Type a message...">
        <button id="send-button">Send</button>
    `;
    document.body.appendChild(chatContainer);

    // Load the logic and pass the URL
    const script = document.createElement('script');
    script.src = scriptBasePath+'/widget/car-accident-settlement-calculator/calculator.js';
    script.onload = function() {
        // Call a function in calculator.js to pass the URL
        if (typeof initializeChat === 'function') {
            initializeChat(currentUrl);
        }
    };
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