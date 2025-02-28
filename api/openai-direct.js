export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
    const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
    const AZURE_DEPLOYMENT_NAME = 'gpt4o-deployment';

    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY) {
        return res.status(500).json({ error: 'Azure OpenAI configuration is not complete' });
    }

    if (!req.body.messages || !Array.isArray(req.body.messages) || req.body.messages.length === 0) {
        return res.status(400).json({ 
            error: 'Invalid request format',
            details: 'Messages array is required and must not be empty'
        });
    }

    // Validate each message object
    for (const message of req.body.messages) {
        if (!message.role || !message.content || 
            !['user', 'assistant', 'system'].includes(message.role)) {
            return res.status(400).json({
                error: 'Invalid message format',
                details: 'Each message must have valid role and content'
            });
        }
    }

    const fetchWithRetry = async (url, options, maxRetries = 3, timeout = 60000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });
                clearTimeout(id);
                return response;
            } catch (error) {
                clearTimeout(id);
                
                if (error.name === 'AbortError') {
                    console.log(`Request timeout on attempt ${attempt}`);
                } else {
                    console.log(`Request failed on attempt ${attempt}:`, error.message);
                }

                if (attempt === maxRetries) {
                    throw new Error(
                        error.name === 'AbortError' 
                            ? `Request timed out after ${maxRetries} attempts` 
                            : error.message
                    );
                }

                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    };

    try {
        const apiVersion = '2024-02-15-preview';
        const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${apiVersion}`;

        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_OPENAI_KEY,
            },
            body: JSON.stringify({
                messages: req.body.messages,
                temperature: 0.7,
                max_tokens: 11264
            }),
        }, 3, 60000); // 3 retries, 60 second timeout

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch {
                errorDetails = errorText;
            }
            throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText}\n${JSON.stringify(errorDetails)}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error.message.includes('timed out') 
            ? 'Request timed out while waiting for Azure OpenAI API'
            : 'Error fetching data from Azure OpenAI API';
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.message
        });
    }
}
  