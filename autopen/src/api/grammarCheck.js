export async function checkGrammarLanguageTool(text) {
    try {
      const response = await fetch("https://api.languagetool.org/v2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          language: "en-US",
        }),
      });
  
      if (!response.ok) throw new Error("LanguageTool API request failed");
  
      const data = await response.json();
      
      return data.matches.map((match) => ({
        offset: match.offset,
        length: match.length,
        replacement: match.replacements.length > 0 
          ? match.replacements[0].value
          : null,
      }));
    } catch (error) {
      console.error("Error checking grammar with LanguageTool:", error);
      return [];
    }
  }
  
  export async function checkGrammarCombined(text) {
    const results = [];
  
    const languageToolErrors = await checkGrammarLanguageTool(text);
    results.push(...languageToolErrors);
  
    const uniqueErrors = Array.from(new Set(results.map(JSON.stringify))).map(JSON.parse);
    return uniqueErrors;
  }
  