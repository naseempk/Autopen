import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Undo, Redo, Save, Home,Wand2 } from "lucide-react"; 
import { checkGrammarCombined } from "../api/grammarCheck";
import { analyzeToneConsistency, checkToneConsistency } from "../api/toneCheck"; 
import { analyzeGenre } from "../api/genreCheck";
import { generateSuggestions } from "../api/suggestionApi";
import { generateCharacters } from "../api/characterAPI";
import { generateDialogues } from "../api/DialoguesAPI";
import { useSearchParams } from "react-router-dom";
import axios from "axios"; 

export default function EditorPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [toneIssues, setToneIssues] = useState([]); 
  const [genre, setGenre] = useState(null); 
  const [popup, setPopup] = useState(null);
  const [title, setTitle] = useState("Untitled Draft"); 
  const textAreaRef = useRef(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [prompt, setPrompt] = useState(content); 
  const [suggestions, setSuggestions] = useState([]);
  const [ignoredWords, setIgnoredWords] = useState([]);
  const [characterSuggestions, setCharacterSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogueSuggestions, setDialogueSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenreLoading, setIsGenreLoading] = useState(false);




  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not authenticated. Please log in to save drafts.");
      navigate("/login");
    }
  }, [navigate]);


  // Real-time grammar check
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (content.trim()) {
        // Grammar Check
        let grammarErrors = await checkGrammarCombined(content);
        grammarErrors = grammarErrors.filter(error => !ignoredWords.includes(error.offset)); // Filter out ignored words
        setErrors(grammarErrors);
  
        // Tone Consistency Check
        const toneAnalysis = await analyzeToneConsistency(content);
        setToneIssues(toneAnalysis || []);
      } else {
        setErrors([]);
        setToneIssues([]);
      }
    }, 500);
  
    return () => clearTimeout(timeout);
  }, [content, ignoredWords]); 
  

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (content.trim()) {
        const sentences = content.split(/[\.,]\s*/).filter(s => s.length > 0);
  
        let analyzedSections = [];
  
        for (let sentence of sentences) {
          const sentimentResult = await analyzeToneConsistency(sentence); // Analyze each sentence separately
  
          if (sentimentResult) {
            analyzedSections.push({
              text: sentence,
              sentiment: sentimentResult.sentiment, // Use extracted sentiment (Positive, Neutral, Negative)
              negative: sentimentResult.negative,
              neutral: sentimentResult.neutral,
              positive: sentimentResult.positive,
              score: sentimentResult.score,
            });
          }
        }
  
        console.log("Analyzed Sections:", analyzedSections); 
  
        if (analyzedSections.length > 1) {
          const flagged = checkToneConsistency(analyzedSections);
          console.log("Flagged Tone Issues:", flagged);
          setToneIssues(flagged);
        } else {
          setToneIssues([]); 
        }
      } else {
        setToneIssues([]); 
      }
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [content]);
  

  const handleWordClick = (error, event) => {
    if (ignoredWords.includes(error.offset)) return;
  
    const textAreaRect = textAreaRef.current.getBoundingClientRect();
    const cursorPosition = event.clientX - textAreaRect.left;
  
    setPopup({
      x: cursorPosition,
      y: textAreaRect.top - 35,
      suggestion: error.replacement,
      index: error.offset,
      length: error.length,
    });
  };

  const renderPopup = () => {
    if (!popup) return null;
    return (
      <div style={{ position: 'absolute', left: popup.x, top: popup.y }} className="popup-content bg-white border border-gray-300 p-0 rounded shadow-lg">
        <button onClick={ignoreCorrection} className="bg-gray-200 px-14 py-3 rounded hover:bg-gray-300">
          ❌
        </button>
      </div>
    );
  };

  const applyCorrection = async () => {
    if (!popup) return;
    const { index, length, suggestion } = popup;
    const newText = content.slice(0, index) + suggestion + content.slice(index + length);
    updateContent(newText);
    setPopup(null);
  };

  const ignoreCorrection = () => {
    setIgnoredWords([...ignoredWords, popup.index]);
    setPopup(null);
  };


  const updateContent = (newText) => {
    setHistory([...history, content]);
    setRedoStack([]);
    setContent(newText);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      setRedoStack([content, ...redoStack]);
      setContent(previousState);
      setHistory([...history]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.shift();
      setHistory([...history, content]);
      setContent(nextState);
      setRedoStack([...redoStack]);
    }
  };

  // Function to save draft
  const handleSaveDraft = async () => {
    const token = localStorage.getItem("token"); // 🔥 Get token

    if (!token) {
        alert("User not authenticated. Please log in again.");
        navigate("/login");
        return;
    }

    if (!content.trim()) {
        alert("Cannot save an empty draft!");
        return;
    }

    try {
        console.log("Sending draft with token:", token);

        const response = await axios.post(
            "http://localhost:5000/api/drafts/save-draft",
            { title, content, aiGeneratedContent: "", grammarErrors: errors },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            }
        );

        if (response.data) {
            alert("Draft saved successfully!");
            console.log("Draft saved:", response.data);
        }
    } catch (error) {
        console.error("Error saving draft:", error.response?.data || error.message);
        alert("Failed to save draft. Please try again.");
    }
};



  

  const handleGenreCheck = async () => {
    if (!content.trim()) {
      alert("Please enter text to analyze the genre.");
      return;
    }
    setIsGenreLoading(true);
    try {
      const detectedGenre = await analyzeGenre(content);
      setGenre(detectedGenre);
    } catch (error) {
      console.error("Error analyzing genre:", error);
      alert("Failed to analyze genre. Please try again.");
    }finally{
      setIsGenreLoading(false);
    }
  };

  const handleGenerate = async (type) => {
    if (!prompt.trim()) return;
  
    setIsLoading(true); // Start loading
  
    try {
      switch (type) {
        case "characters":
          await handleGenerateCharacters();
          break;
        case "dialogues":
          await handleGenerateDialogues();
          break;
        case "suggestions":
          await generateSuggestionsHandler();
          break;
        default:
          console.error("Invalid type");
      }
    } catch (err) {
      console.error("Error during generation:", err);
    } finally {
      setIsLoading(false); // Stop loading
      setShowPromptModal(false); // Close modal after action
    }
  };
  
  
  const generateSuggestionsHandler = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt to generate suggestions.");
      return;
    }
  
    const suggestions = await generateSuggestions(prompt);
    if (suggestions.length > 0) {
      setSuggestions(suggestions);
      setShowPromptModal(false); 
    } else {
      alert("Failed to generate suggestions. Please try again.");
    }
  };

  const handleGenerateCharacters = async () => {
    if (!prompt) return; // Ensure a prompt is provided

    setLoading(true); // Show loading state
    try {
        const suggestions = await generateCharacters(prompt);
        setCharacterSuggestions(suggestions); 
    } catch (error) {
        console.error("Error generating characters:", error);
    }
    setLoading(false); 
};

const handleGenerateDialogues = async () => {
  if (!prompt) return; // Ensure a prompt is provided

  setLoading(true); // Show loading state
  try {
    const suggestions = await generateDialogues(prompt);
    setDialogueSuggestions(suggestions); // Update state with suggestions
  } catch (error) {
    console.error("Error generating dialogues:", error);
  }
  setLoading(false); // Hide loading state
};

  const insertSuggestion = (suggestion) => {
    if (!textAreaRef.current) return;
    const { selectionStart, selectionEnd } = textAreaRef.current;
    const newText = content.substring(0, selectionStart) + suggestion + content.substring(selectionEnd);
    setContent(newText);
  };

  const handleGoBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-4">📌 Menu</h2>
        <button
          onClick={handleGoBackToDashboard}
          className="flex items-center p-2 hover:bg-indigo-100 rounded transition"
        >
          <Home className="mr-2" /> Go Back to Dashboard
        </button>

  <div className="mt-6">
  <h3 className="text-md font-semibold mb-2">✨ Character & Word Suggestions</h3>
  <button
  onClick={() => {
    const prmt="I'm writing something which goes like "+"\""+content+"\""+"\n"+"help me for ";
    setPrompt(prmt); 
    setShowPromptModal(true);
  }}
  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
>
  <Wand2 size={18} /> Generate Suggestions
</button>


  {/* Display AI Suggestions */}
  {(suggestions.length > 0 || characterSuggestions.length > 0 || dialogueSuggestions.length > 0) ? (
  <ul className="mt-3">
    {/* Existing suggestions */}
    {suggestions.map((suggestion, i) => (
      <li
        key={`suggestion-${i}`}
        onClick={() => insertSuggestion(suggestion)}
        className="p-2 bg-gray-200 rounded-lg my-1 cursor-pointer hover:bg-gray-300"
      >
        {suggestion.split(" ").slice(0, 10).join(" ")}... {/* Show only first 10 words */}
      </li>
    ))}

    {/* Character suggestions */}
    {characterSuggestions.map((char, i) => (
      <li
        key={`character-${i}`}
        onClick={() => insertSuggestion(char)}
        className="p-2 bg-blue-200 rounded-lg my-1 cursor-pointer hover:bg-blue-300"
      >
        {char.split(" ").slice(0, 10).join(" ")}... {/* Show only first 10 words */}
      </li>
    ))}

    {dialogueSuggestions.map((dialogue, i) => (
            <li
              key={`dialogue-${i}`}
              onClick={() => insertSuggestion(dialogue)}
              className="p-2 bg-blue-200 rounded-lg my-1 cursor-pointer hover:bg-blue-300"
            >
              {dialogue.split(" ").slice(0, 10).join(" ")}... {/* Show only first 10 words */}
            </li>
          ))}
  </ul>
) : (
  <p className="text-gray-500 text-sm mt-2">No suggestions yet.</p>
)}

</div>

      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 p-6 bg-white relative">
        <div className="border-b pb-2 mb-4 flex gap-2">
          <button onClick={handleUndo}><Undo size={20} /></button>
          <button onClick={handleRedo}><Redo size={20} /></button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter draft title"
            className="px-4 py-2 border rounded flex-1"
          />
          <button 
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
          >
            <Save size={20} /> Save Draft
          </button>
        </div>

        <div className="relative flex">
  {/* Text Editor Section */}
  <div className="relative flex-1">
    <textarea
      ref={textAreaRef}
      className="w-full h-[70vh] p-4 border rounded-lg focus:outline-none"
      value={content}
      onChange={(e) => updateContent(e.target.value)}
      placeholder="Start writing your story..."
    />
    {renderPopup()}
    <button 
  onClick={handleGenreCheck}
  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
  disabled={isGenreLoading}
  aria-busy={isGenreLoading}
  aria-live="polite"
>
  {isGenreLoading ? (
    <>
      <svg 
        className="animate-spin h-5 w-5 text-white" 
        viewBox="0 0 24 24" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>Detecting...</span>
    </>
  ) : (
    <span>Detect Genre</span>
  )}
</button>

    
    {genre && (
    <div className="mt-2 p-2 border rounded bg-gray-100">
      <p><strong>Detected Genre:</strong> {genre}</p>
    </div>
    )}

    {/* Highlighting Grammar Mistakes */}
    {errors.map((error, i) => (
      <span 
        key={i} 
        className="absolute bg-red-200 underline decoration-red-500 cursor-pointer"
        style={{ left: `${error.offset * 7}px`, top: "10px", position: "absolute" }}
        onClick={(event) => handleWordClick(error, event)}
      >
        {content.substring(error.offset, error.offset + error.length)}
      </span>
    ))}

    {/* Grammar Correction Popup */}
    {popup && (
      <div 
        className="absolute bg-white border p-2 rounded shadow-md cursor-pointer"
        style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
        onClick={applyCorrection}
      >
        {popup.suggestion}
      </div>
    )}
  </div>

 {/* Sidebar for Tone Issues */}
<div className="w-64 p-4 border-l bg-gray-50">
  <h3 className="text-lg font-semibold mb-2">🔍 Tone Issues</h3>
  {toneIssues.length > 0 ? (
    toneIssues.map((issue, i) => (
      <div key={i} className="p-2 mb-2 border rounded bg-red-100">
        <p className="text-sm">⚠️ <strong>Issue:</strong> {issue.explanation}</p>
        <p className="text-sm">📉 <strong>Sentiment Score:</strong> {issue.sentiment}</p>
        <p className="text-sm">💡 <strong>Suggestion:</strong> {issue.suggestion}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">✅ No tone inconsistencies detected.</p>
  )}
</div>



</div>
</main>

{/* Prompt Input Modal */}
{showPromptModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-black">Enter a Prompt</h2>

      {/* Function Buttons */}
      <div className="flex space-x-3 mb-4">
        <button
          className="px-5 py-3 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
          onClick={() => handleGenerate("characters")}
        >
          Generate Characters
        </button>
        <button
          className="px-5 py-3 border border-black text-black rounded-lg hover:bg-black hover:text-white transition"
          onClick={() => handleGenerate("dialogues")}
        >
          Generate Dialogues
        </button>
      </div>

      {isLoading && (
      <div className="flex items-center space-x-2 mb-4 text-black">
    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
    </svg>
    <span className="text-sm">Generating, please wait...</span>
      </div>
      )}


      {/* Prompt Input */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-4 border border-black rounded-lg text-black bg-white text-lg"
        rows="8"
        placeholder="Enter your prompt..."
      />

      {/* Action Buttons */}
      <div className="flex justify-end mt-5 space-x-3">
        <button
          className="px-5 py-3 border border-black text-black rounded-lg hover:bg-gray-200 transition"
          onClick={() => setShowPromptModal(false)}
        >
          Cancel
        </button>
        <button
          className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          onClick={() => handleGenerate("suggestions")}
        >
          Generate
        </button>
      </div>
    </div>
  </div>
)}




  

</div>
  );
}
