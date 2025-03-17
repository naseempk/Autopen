import { useState, useRef, useEffect } from "react";
import { Undo, Redo } from "lucide-react";
import { checkGrammarCombined } from "../api/grammarCheck";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [popup, setPopup] = useState(null);
  const textAreaRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (content.trim()) {
        const grammarErrors = await checkGrammarCombined(content);
        setErrors(grammarErrors);
      } else {
        setErrors([]);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [content]);

  const handleWordClick = (error, event) => {
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

  const applyCorrection = async () => {
    if (!popup) return;
    const { index, length, suggestion } = popup;
    const newText = content.slice(0, index) + suggestion + content.slice(index + length);
    updateContent(newText);
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 shadow-lg flex flex-col">
        <h2 className="text-lg font-semibold mb-4">📌 Menu</h2>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 p-6 bg-white relative">
        <div className="border-b pb-2 mb-4 flex gap-2">
          <button onClick={handleUndo}><Undo size={20} /></button>
          <button onClick={handleRedo}><Redo size={20} /></button>
        </div>

        <div className="relative">
          <textarea
            ref={textAreaRef}
            className="w-full h-[70vh] p-4 border rounded-lg focus:outline-none"
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Start writing your story..."
          />

          {/* Highlighting grammar mistakes */}
          {errors.map((error, i) => (
            <span 
              key={i} 
              className="absolute bg-red-200 underline decoration-red-500 cursor-pointer"
              style={{ 
                left: `${error.offset * 7}px`, 
                top: "10px", 
                position: "absolute" 
              }}
              onClick={(event) => handleWordClick(error, event)}
            >
              {content.substring(error.offset, error.offset + error.length)}
            </span>
          ))}

          {/* Suggestion popup */}
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
      </main>
    </div>
  );
}
