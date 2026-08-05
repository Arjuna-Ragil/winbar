import { useState, useEffect } from 'react';
import { Prompt } from '../../../../wailsjs/go/handlers/Chat';
import { GetCompanions, GetCompanionImageAsBase64 } from '../../../../wailsjs/go/handlers/Companion';

export default function useAIChat() {
    const [companions, setCompanions] = useState([]);
    const [activeCompanionId, setActiveCompanionId] = useState('');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [currentExpression, setCurrentExpression] = useState('');
    const [fullMessage, setFullMessage] = useState('');
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [hideUI, setHideUI] = useState(false);

    const activeCompanion = companions.find(c => c.id === activeCompanionId) || null;

    useEffect(() => {
        if (!activeCompanionId || !currentExpression) return;
        setImageError(false);
        setCurrentImageSrc('');
        GetCompanionImageAsBase64(activeCompanionId, currentExpression)
            .then(base64 => setCurrentImageSrc(base64))
            .catch(err => {
                console.warn("Failed to load image:", err);
                setImageError(true);
            });
    }, [activeCompanionId, currentExpression]);

    useEffect(() => {
        const fetchCompanions = async () => {
            try {
                const data = await GetCompanions();
                if (data && data.length > 0) {
                    setCompanions(data);
                    setActiveCompanionId(data[0].id);
                }
            } catch (err) {
                console.error("Failed to load companions:", err);
            }
        };
        fetchCompanions();
    }, []);

    useEffect(() => {
        if (activeCompanion) {
            setFullMessage(activeCompanion.startMessage || 'Hello there! How can I help you today?');
            setCurrentExpression('happy');
            setMessages([]);
        }
    }, [activeCompanionId, companions]);

    useEffect(() => {
        if (!fullMessage) {
            setDisplayedMessage('');
            return;
        }
        let i = 0;
        setDisplayedMessage(fullMessage.charAt(0));
        const interval = setInterval(() => {
            i++;
            if (i >= fullMessage.length) {
                clearInterval(interval);
                return;
            }
            setDisplayedMessage(prev => prev + fullMessage.charAt(i));
        }, 30);
        return () => clearInterval(interval);
    }, [fullMessage]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !activeCompanion) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsLoading(true);
        setFullMessage('');

        try {
            const payload = [
                { role: 'system', content: activeCompanion.systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: userText }
            ].map(msg => ({ role: msg.role, content: msg.content }));

            const response = await Prompt(payload);

            let parsedExp = 'normal';
            let parsedMsg = response;

            try {
                let cleanJson = response.trim();
                if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json\n?/, '');
                if (cleanJson.endsWith('```')) cleanJson = cleanJson.replace(/```$/, '');

                const parsed = JSON.parse(cleanJson);
                if (parsed.expression) parsedExp = parsed.expression.toLowerCase();
                if (parsed.message) parsedMsg = parsed.message;
            } catch (e) {
                console.warn("Failed to parse JSON response:", response);
            }

            if (activeCompanion.expressions && activeCompanion.expressions.length > 0) {
                if (!activeCompanion.expressions.includes(parsedExp)) {
                    parsedExp = 'normal';
                }
            }

            setCurrentExpression(parsedExp);
            setFullMessage(parsedMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: parsedMsg, expression: parsedExp }]);

        } catch (error) {
            setFullMessage(`Error: ${error}`);
            setCurrentExpression('normal');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        companions, activeCompanion, activeCompanionId, setActiveCompanionId,
        messages, setMessages, input, setInput, isLoading,
        currentExpression, fullMessage, setFullMessage, displayedMessage, setDisplayedMessage,
        showHistory, setShowHistory, imageError, currentImageSrc, hideUI, setHideUI,
        handleSend
    };
}
