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

    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'DeepSeek API key is not configured' });
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

    const fetchWithTimeout = async (url, options, timeout = 8000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    };

    try {
        console.log('Request payload:', {
            model: "deepseek-chat",
            messages: req.body.messages,
            temperature: 0.7,
            max_tokens: 2048
        });

        const response = await fetchWithTimeout(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: req.body.messages,
                temperature: 0.7,
                max_tokens: 2048
            }),
        }, 8000);

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch {
                errorDetails = errorText;
            }
            console.error('DeepSeek API error details:', {
                status: response.status,
                statusText: response.statusText,
                errorText: errorText
            });
            throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}\n${JSON.stringify(errorDetails)}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error fetching data from DeepSeek API',
            details: error.message
        });
    }
}
  