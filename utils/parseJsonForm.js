export const parseJsonForm = async (rawJsonString) => {
  console.log('Original string:', rawJsonString);

  let jsonFormString = rawJsonString.trim();

  // Remove backticks if present
  if (jsonFormString.startsWith('```') && jsonFormString.endsWith('```')) {
    jsonFormString = jsonFormString.slice(3, -3);
  }

  try {
    return JSON.parse(jsonFormString);
  } catch (error) {
    console.error('Error parsing JSON:', error, 'Original string:', jsonFormString);
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
};
