import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function TranscriptViewer({ transcriptData, isLive = false }) {
  const [activeTab, setActiveTab] = useState('transcript');
  const [aiSummary, setAiSummary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // NEW: Translation States
  const [targetLanguage, setTargetLanguage] = useState('Original');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTranscript, setTranslatedTranscript] = useState(null);

  // Mock data fallback for demonstration
  const defaultTranscript = [
    { time: '00:00', speaker: 'Client', text: 'Hello, can you hear me clearly?' },
    { time: '00:05', speaker: 'Interpreter (Li Wei)', text: 'Yes, I can hear you perfectly. I am ready to begin the interpretation session. Please proceed.' },
    { time: '00:15', speaker: 'Client', text: 'Great. We are here to discuss the Q3 financial results and the new supply chain logistics for the Shanghai office.' },
    { time: '00:28', speaker: 'Interpreter (Li Wei)', text: 'Understood. I will provide simultaneous interpretation for the financial and logistics terminology. Please let me know if you need me to pause for consecutive interpretation at any point.' },
  ];

  const transcript = transcriptData && transcriptData.length > 0 ? transcriptData : defaultTranscript;
  
  // Use translated transcript if available, otherwise use original
  const displayTranscript = translatedTranscript || transcript;

  // Function to call the Supabase Edge Function for Summary
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const transcriptText = transcript
        .map(entry => `[${entry.time}] ${entry.speaker}: ${entry.text}`)
        .join('\n');

      const { data, error: fnError } = await supabase.functions.invoke('generate-ai-summary', {
        body: { transcriptText }
      });

      if (fnError) throw new Error(fnError.message);
      
      const parsedSummary = typeof data === 'string' ? JSON.parse(data) : data;
      setAiSummary(parsedSummary);
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setError('Failed to generate summary. Please check your OpenAI API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Function to handle Translation
  const handleTranslate = async () => {
    if (targetLanguage === 'Original') {
      setTranslatedTranscript(null);
      return;
    }
    
    setIsTranslating(true);
    try {
      const transcriptText = transcript
        .map(entry => `[${entry.time}] ${entry.speaker}: ${entry.text}`)
        .join('\n');

      const { data, error: fnError } = await supabase.functions.invoke('generate-ai-summary', {
        body: { 
          transcriptText,
          action: 'translate',
          targetLanguage 
        }
      });

      if (fnError) throw new Error(fnError.message);
      
      // Parse the response (Edge function should return { translatedTranscript: [...] })
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      setTranslatedTranscript(parsedData.translatedTranscript || transcript); 
    } catch (err) {
      console.error('Error translating:', err);
      alert('Failed to translate transcript. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to download the transcript as a text file
  const handleDownload = () => {
    let content = `ACCESS LINGUA - INTERPRETATION TRANSCRIPT\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    if (targetLanguage !== 'Original') {
      content += `Translated to: ${targetLanguage}\n`;
    }
    content += `----------------------------------------\n\n`;
    
    // Use displayTranscript so it downloads the translated version if active
    displayTranscript.forEach(entry => {
      content += `[${entry.time}] ${entry.speaker}\n${entry.text}\n\n`;
    });

    if (aiSummary) {
      content += `----------------------------------------\n`;
      content += `AI SUMMARY\n`;
      content += `Overview: ${aiSummary.overview}\n\n`;
      content += `Key Terms: ${aiSummary.keyTerms.join(', ')}\n\n`;
      content += `Action Items:\n`;
      aiSummary.actionItems.forEach((item, idx) => {
        content += `- ${item}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Access-Lingua-Transcript-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-brand-navy text-white p-4 flex justify-between items-center">
        <h3 className="font-bold flex items-center space-x-2">
          <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>AI Transcript & Summary</span>
        </h3>
        {isLive && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span> LIVE
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button 
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'transcript' ? 'text-brand-royal border-b-2 border-brand-royal bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Full Transcript
        </button>
        <button 
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 text-sm font-bold transition ${activeTab === 'summary' ? 'text-brand-royal border-b-2 border-brand-royal bg-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          AI Summary & Actions
        </button>
      </div>

      {/* NEW: Translation Controls (Only visible in Transcript Tab) */}
      {activeTab === 'transcript' && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase">Translate Transcript:</span>
          <div className="flex items-center space-x-2">
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-royal bg-white"
            >
              <option value="Original">Original Language</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Mandarin Chinese">Mandarin Chinese</option>
              <option value="Igbo">Igbo</option>
            </select>
            {targetLanguage !== 'Original' && (
              <button 
                onClick={handleTranslate}
                disabled={isTranslating}
                className="text-xs bg-brand-royal text-white px-3 py-1.5 rounded hover:bg-brand-navy transition disabled:opacity-50 flex items-center space-x-1"
              >
                {isTranslating ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Translating...</span>
                  </>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 max-h-[500px]">
        
        {/* TRANSCRIPT TAB */}
        {activeTab === 'transcript' && (
          <div className="space-y-4">
            {displayTranscript.map((entry, index) => (
              <div key={index} className="flex space-x-3">
                <span className="text-xs font-mono text-gray-400 flex-shrink-0 mt-1">{entry.time}</span>
                <div className="flex-grow">
                  <p className={`text-sm font-bold mb-0.5 ${entry.speaker.includes('Interpreter') ? 'text-brand-royal' : 'text-gray-800'}`}>
                    {entry.speaker}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ))}
            {isLive && !translatedTranscript && (
              <div className="flex space-x-3 opacity-50">
                <span className="text-xs font-mono text-gray-400 flex-shrink-0 mt-1">--:--</span>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-brand-royal mb-0.5">Interpreter (Li Wei)</p>
                  <p className="text-sm text-gray-600 italic animate-pulse">Listening and transcribing...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            
            {/* Generate Button / Loading State */}
            {!aiSummary && !isGenerating && !error && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">Click below to let AI analyze this session and generate a professional summary.</p>
                <button 
                  onClick={handleGenerateSummary}
                  className="bg-brand-royal hover:bg-brand-navy text-white text-sm font-bold py-2.5 px-6 rounded-lg transition flex items-center justify-center space-x-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate AI Summary</span>
                </button>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-brand-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-600 font-medium">Analyzing transcript with AI...</p>
                <p className="text-xs text-gray-400 mt-1">This may take a few seconds.</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm text-center">
                <p className="font-bold mb-1">Error</p>
                <p>{error}</p>
                <button onClick={handleGenerateSummary} className="mt-3 text-xs font-bold underline hover:text-red-800">Try Again</button>
              </div>
            )}

            {/* SUCCESS: AI Summary Display */}
            {aiSummary && (
              <>
                {/* Overview */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session Overview</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                    {aiSummary.overview}
                  </p>
                </div>

                {/* Key Terms */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Terminology Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiSummary.keyTerms.map((term, idx) => (
                      <span key={idx} className="bg-brand-cyan/10 text-brand-navy text-xs font-bold px-2.5 py-1 rounded-full border border-brand-cyan/20">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Suggested Action Items</h4>
                  <ul className="space-y-2">
                    {aiSummary.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Export Button */}
            <button 
              onClick={handleDownload}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold py-2.5 rounded-lg transition flex items-center justify-center space-x-2 mt-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Transcript (.txt)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TranscriptViewer;