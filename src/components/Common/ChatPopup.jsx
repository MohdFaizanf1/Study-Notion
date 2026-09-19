import React, { useState } from 'react';
import { MessageCircle, X, Send, Search, ChevronDown, ChevronUp } from 'lucide-react';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Choose a question from the list or type your own.", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 50 predefined questions
  const predefinedQuestions = [
    "What are your main features?",
    "How can I reset my password?",
    "Where do I find my account settings?",
    "How do I export my data?",
    "Can I change my username?",
    "What payment methods do you accept?",
    "How do I cancel my subscription?",
    "Is there a mobile app available?",
    "How do I contact support?",
    "What are the system requirements?",
    "How do I share files with others?",
    "Can I work offline?",
    "How secure is my data?",
    "What backup options are available?",
    "How do I set up two-factor authentication?",
    "What's your privacy policy?",
    "How do I delete my account?",
    "Can I integrate with other tools?",
    "What's included in the free plan?",
    "How do I upgrade my account?",
    "Is there an API available?",
    "How do I generate reports?",
    "What formats can I import?",
    "How do I add team members?",
    "What's your uptime guarantee?",
    "How often do you release updates?",
    "Can I schedule automated tasks?",
    "How do I customize notifications?",
    "What languages are supported?",
    "How do I set up email forwarding?",
    "Can I white-label the interface?",
    "What's your refund policy?",
    "How do I set up SSO?",
    "What analytics are available?",
    "How do I create custom fields?",
    "Can I set user permissions?",
    "How do I create templates?",
    "What's your data retention policy?",
    "How do I set up workflows?",
    "Can I bulk import data?",
    "How do I set up alerts?",
    "What collaboration features exist?",
    "How do I track changes?",
    "Can I customize the dashboard?",
    "How do I set up billing?",
    "What support options are available?",
    "How do I export reports?",
    "Can I set usage limits?",
    "How do I manage team access?",
    "What compliance certifications do you have?"
  ];

  const filteredQuestions = predefinedQuestions.filter(question =>
    question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuestionSelect = (question) => {
    setInputText(question);
    setShowQuestions(false);
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      // Add user message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: inputText,
        isBot: false
      }]);

      // Simulate response
      setIsLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: `Thanks for your question about "${inputText}". This is a demo response.`,
          isBot: true
        }]);
        setIsLoading(false);
      }, 1000);

      setInputText('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-medium">Chat Assistant</h3>
            <p className="text-sm text-white/80">Choose a question or ask your own</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.isBot
                      ? 'bg-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>

          {/* Questions Panel */}
          {showQuestions && (
            <div className="border-t border-gray-200 max-h-48 overflow-y-auto">
              <div className="p-2 sticky top-0 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(question)}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4 flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or choose a question..."
                className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {showQuestions ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg p-2 transition-colors duration-200`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;