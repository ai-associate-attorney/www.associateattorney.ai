import React, { useState, useRef, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";

interface Message {
  text: string;
  type: 'user' | 'assistant';
}

interface DamageInputs {
  medicalBills: number;
  futureMedicalExpenses: number;
  propertyDamage: number;
  lostWages: number;
  futureLostWages: number;
  generalDamagesMultiplier: number;
}

const AUTO_UPDATE_FROM_AI = true; // This can be controlled programmatically

const apiBaseUrl = 'https://cases-vue-app.vercel.app/api/openai-direct';

const CarAccidentSettlementCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DamageInputs>({
    medicalBills: 0,
    futureMedicalExpenses: 0,
    propertyDamage: 0,
    lostWages: 0,
    futureLostWages: 0,
    generalDamagesMultiplier: 1.5
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      text: 'Hello! I can help you understand your car accident settlement calculation. What would you like to know?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'calculator'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (field: keyof DamageInputs, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const calculateSettlement = () => {
    const economicDamages = 
      inputs.medicalBills +
      inputs.futureMedicalExpenses +
      inputs.propertyDamage +
      inputs.lostWages +
      inputs.futureLostWages;

    const totalDamages = economicDamages * inputs.generalDamagesMultiplier;
    return totalDamages;
  };

  const formatAIResponse = (text: string) => {
    // Remove the JSON block first
    text = text.replace(/```json[\s\S]*?```/g, '');
    
    // Convert markdown list items
    text = text.replace(/^\s*[-*]\s+/gm, '• ');
    
    // Convert markdown headers
    text = text.replace(/^#{1,6}\s+(.+)$/gm, '<strong>$1</strong>');
    
    // Convert markdown bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown italics
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Convert newlines to <br/>
    text = text.replace(/\n\n/g, '<br/><br/>');
    
    // Convert markdown horizontal rules
    text = text.replace(/^---$/gm, '<hr class="my-4"/>');
    
    // Trim any extra whitespace that might be left after removing JSON
    text = text.trim();
    
    return text;
  };

  const extractNumberFromText = (text: string): number | null => {
    const matches = text.match(/\$?([\d,]+(\.\d{2})?)/);
    if (matches) {
      return parseFloat(matches[1].replace(/,/g, ''));
    }
    return null;
  };

  const detectAndUpdateFields = (message: string) => {
    if (!AUTO_UPDATE_FROM_AI) return;

    try {
      // Extract JSON block from the message
      const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[1]);
        if (jsonData.detected_fields) {
          jsonData.detected_fields.forEach((field: { field: keyof DamageInputs, value: number }) => {
            if (field.value && !isNaN(field.value)) {
              handleInputChange(field.field, field.value.toString());
            }
          });
        }
      }
    } catch (error) {
      console.error('Error parsing AI response fields:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { type: 'user', text: userInput.trim() }
    ];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const requiredFields = {
      medicalBills: 'Medical Bills',
      futureMedicalExpenses: 'Future Medical Expenses',
      propertyDamage: 'Property Damage',
      lostWages: 'Lost Wages',
      futureLostWages: 'Future Lost Wages'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => inputs[key] === 0)
      .map(([_, label]) => label);

    const systemPrompt = `You are an AI assistant helping with car accident settlement calculations.

Current status:
${Object.entries(requiredFields)
  .map(([key, label]) => `${label}: ${inputs[key] === 0 ? 'Not provided' : '$' + inputs[key].toLocaleString()}`)
  .join('\n')}
General Damages Multiplier: ${inputs.generalDamagesMultiplier}x

Your role:
1. If there are missing fields (${missingFields.join(', ')}), ask for them one at a time.
2. Explain that the General Damages Multiplier (currently ${inputs.generalDamagesMultiplier}x) can be adjusted between 1.5x to 5x based on injury severity.
3. When all fields are provided, show:
   - The estimated settlement: $${calculateSettlement().toLocaleString()}
   - A brief summary of what this means

Response Format:
Always include a JSON block at the end of your response in this format:
\`\`\`json
{
  "detected_fields": [
    {
      "field": "medicalBills",
      "value": 5000.00
    },
    {
      "field": "generalDamagesMultiplier",
      "value": 2.5
    }
  ]
}
\`\`\`

Guidelines:
- Ask for missing information naturally and conversationally
- Explain why each piece of information is important
- Help users understand how the multiplier affects their settlement
- Provide context about what each field means
- Always extract and include any mentioned dollar amounts or multiplier values in the JSON response
- Valid fields are: medicalBills, futureMedicalExpenses, propertyDamage, lostWages, futureLostWages, generalDamagesMultiplier

Remember to:
1. Maintain a conversational tone in your main response
2. Include the JSON block at the end of EVERY response
3. Only include fields in the JSON that were actually mentioned or discussed in the current message
4. Parse currency values to numbers (remove $ and commas)
5. Keep multiplier values between 1.5 and 5.0`;

    try {
      const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt //"You are an AI assistant helping with date and time" //systemPrompt
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: userInput.trim()
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      setMessages([
        ...newMessages,
        { 
          type: 'assistant', 
          text: formatAIResponse(data.choices[0].message.content)
        }
      ]);

      if (AUTO_UPDATE_FROM_AI) {
        detectAndUpdateFields(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { 
          type: 'assistant', 
          text: 'Sorry, there was an error processing your request.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const MoneyInput = ({ label, field }: { label: string; field: keyof DamageInputs }) => {
    const [localValue, setLocalValue] = React.useState('');

    const handleBlur = () => {
      const numValue = localValue === '' ? 0 : parseFloat(localValue.replace(/,/g, ''));
      handleInputChange(field, numValue.toString());
    };

    React.useEffect(() => {
      if (inputs[field] === 0 && localValue === '') return;
      setLocalValue(inputs[field].toLocaleString('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
    }, [inputs[field]]);

    return (
      <div className="mb-8">
        <label htmlFor={field} className="block text-base font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            id={field}
            name={field}
            type="text"
            inputMode="numeric"
            className="pl-7 pr-4 py-3 text-lg"
            placeholder="0.00"
            value={localValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              if (raw === '' || /^\d*\.?\d{0,2}$/.test(raw)) {
                setLocalValue(raw);
              }
            }}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        <div className="bg-gray-100 min-h-[calc(100vh-5rem)] p-4 md:p-8">
          <div className="container mx-auto max-w-7xl h-full">
            {/* Mobile Toggle Buttons */}
            <div className="lg:hidden mb-4 flex gap-2">
              <button
                onClick={() => setActiveView('chat')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeView === 'chat' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Chat with AI Assistant
              </button>
              <button
                onClick={() => setActiveView('calculator')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeView === 'calculator' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Calculator
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:items-end">
              {/* Calculator Section */}
              <div className={`flex-1 ${activeView === 'calculator' ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-lg p-8 form_wrapper_2">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Car Accident Settlement Calculator
                    </h1>
                    <p className="text-lg text-slate-600">
                      Estimate the potential value of your car accident settlement claim
                    </p>
                  </div>
                  
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <div>
                        <MoneyInput label="Medical Bills" field="medicalBills" />
                        <MoneyInput label="Property Damage" field="propertyDamage" />
                        <MoneyInput label="Future Lost Wages" field="futureLostWages" />
                      </div>
                      <div>
                        <MoneyInput label="Future Medical Expenses" field="futureMedicalExpenses" />
                        <MoneyInput label="Lost Wages" field="lostWages" />
                        <div className="mb-8">
                          <label htmlFor="generalDamagesMultiplier" className="block text-base font-medium text-gray-700 mb-2">
                            General Damages Multiplier
                          </label>
                          <div className="flex items-center gap-4">
                            <Input
                              id="generalDamagesMultiplier"
                              type="range"
                              min="1.5"
                              max="5"
                              step="0.01"
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              value={inputs.generalDamagesMultiplier}
                              onChange={(e) => handleInputChange('generalDamagesMultiplier', e.target.value)}
                            />
                            <span className="text-lg font-medium text-gray-900 min-w-[4rem]">
                              {inputs.generalDamagesMultiplier.toFixed(2)}x
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-medium text-blue-900">Estimated Settlement:</span>
                      <span className="text-3xl font-bold text-blue-600">
                        ${calculateSettlement().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <p>Note: This calculator provides a rough estimate of potential settlement value. Actual compensation may vary based on specific circumstances, liability, insurance coverage, and other factors. Consult with a legal professional for accurate evaluation of your case.</p>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className={`lg:w-96 ${activeView === 'chat' ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-8rem)] lg:h-[600px]">
                  {/* Fixed Header */}
                  <div className="h-16 px-6 flex items-center border-b flex-shrink-0">
                    <h3 className="font-semibold">Chat with AI Assistant</h3>
                  </div>
                  
                  {/* Scrollable Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-100 ml-8'
                              : 'bg-gray-100 mr-8'
                          }`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: message.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fixed Input Area */}
                  <div className="h-24 border-t p-4 flex-shrink-0">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent page scroll
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarAccidentSettlementCalculator; 