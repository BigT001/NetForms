export const parseJsonForm = async (rawJsonString) => {
    // Remove leading and trailing backticks (if present)
    let jsonFormString = rawJsonString;
    if (jsonFormString.startsWith('`') && jsonFormString.endsWith('`')) {
      jsonFormString = jsonFormString.slice(1, -1); // Remove first and last character
    }
  
    try {
      return JSON.parse(jsonFormString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw error; // Re-throw the error for handling in other components
    }
  };