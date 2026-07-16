import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to strip HTML tags and extract text content from HTML string
const extractTextFromHtml = (html) => {
  try {
    if (!html) return '';
    // Strip script, style, and noscript tags and their contents
    let text = html.replace(/<(script|style|noscript)[^>]*>([\s\S]*?)<\/\1>/gi, '');
    // Strip all HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    // Return a snippet (first 15k chars) to avoid prompt bloat
    return text.substring(0, 15000);
  } catch (error) {
    console.error('Error stripping HTML:', error);
    return '';
  }
};

// Generic function to send request to Google Gemini API
const callGeminiApi = async (parts, responseMimeType = null) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on the server.');
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: parts
      }
    ]
  };

  if (responseMimeType) {
    payload.generationConfig = {
      responseMimeType: responseMimeType
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', errorText);
    throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!generatedText) {
    throw new Error('Gemini API failed to return generated content.');
  }

  return generatedText;
};

/**
 * Summarize Notes
 */
export const summarizeNote = async (title, content, category) => {
  const prompt = `You are an expert AI summarization assistant. Summarize the following note in a concise paragraph (maximum 3 to 4 sentences). Focus on highlighting the core takeaways, main concepts, and action points.

Note Details:
Title: ${title}
Category: ${category}
Content:
${content}`;

  return await callGeminiApi([{ text: prompt }]);
};

/**
 * Generate Smart Tags for Notes
 */
export const generateNoteTags = async (title, content, category) => {
  const prompt = `Analyze the following note content and generate 3 to 6 highly relevant, specific, lowercase tags. Return ONLY a JSON array of strings (e.g. ["javascript", "mongodb", "tutorial"]). Do not include markdown code block formatting or any explanation.

Note Details:
Title: ${title}
Category: ${category}
Content:
${content}`;

  const resultText = await callGeminiApi([{ text: prompt }], 'application/json');
  try {
    return JSON.parse(resultText.trim());
  } catch (e) {
    console.error('Failed to parse tags JSON:', resultText);
    return [category.toLowerCase()];
  }
};

/**
 * Summarize Youtube Videos and Websites
 */
export const summarizeResource = async (type, title, url, notes) => {
  let scrapedText = '';

  if (type === 'website') {
    try {
      console.log(`Scraping website content for: ${url}`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(6000) // 6 second timeout
      });
      if (res.ok) {
        const html = await res.text();
        scrapedText = extractTextFromHtml(html);
      }
    } catch (err) {
      console.warn(`Scraping failed for ${url}, falling back to title and user notes:`, err.message);
    }
  }

  const prompt = `You are an expert AI summarization assistant. Summarize the following ${type === 'video' ? 'YouTube video' : 'website resource'} in a concise paragraph (maximum 3 to 4 sentences). Focus on summarizing what the resource contains and key learnings.

Resource Details:
Type: ${type}
Title: ${title}
URL: ${url}
User's Personal Notes: ${notes || 'None'}
${scrapedText ? `Web Page Scraped Text:\n${scrapedText}` : ''}`;

  return await callGeminiApi([{ text: prompt }]);
};

/**
 * Generate Smart Tags for Youtube Videos and Websites
 */
export const generateResourceTags = async (type, title, url, notes) => {
  let scrapedText = '';

  if (type === 'website') {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        const html = await res.text();
        scrapedText = extractTextFromHtml(html);
      }
    } catch (err) {
      console.warn(`Scraping failed for ${url} tag generation fallback:`, err.message);
    }
  }

  const prompt = `Analyze the following ${type === 'video' ? 'YouTube video' : 'website resource'} and generate 3 to 6 highly relevant, specific, lowercase tags. Return ONLY a JSON array of strings (e.g. ["tutorial", "react", "css"]). Do not include markdown code block formatting or any explanation.

Resource Details:
Type: ${type}
Title: ${title}
URL: ${url}
User's Personal Notes: ${notes || 'None'}
${scrapedText ? `Web Page Scraped Text:\n${scrapedText}` : ''}`;

  const resultText = await callGeminiApi([{ text: prompt }], 'application/json');
  try {
    return JSON.parse(resultText.trim());
  } catch (e) {
    console.error('Failed to parse tags JSON:', resultText);
    return [type, 'resource'];
  }
};

/**
 * Summarize PDF Document using Gemini Multimodality
 */
export const summarizePdf = async (fileUrlPath, title, notes) => {
  try {
    // Resolve absolute path to the local PDF file
    const fileName = fileUrlPath.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    const pdfBuffer = fs.readFileSync(filePath);
    const base64Data = pdfBuffer.toString('base64');

    const parts = [
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      {
        text: `You are an expert AI document summarizer. Summarize this PDF document in a concise paragraph (maximum 3 to 4 sentences). Focus on the core content, findings, or takeaways. Incorporate context from the user's notes if relevant.
        
Document Title: ${title}
User's Personal Notes: ${notes || 'None'}`
      }
    ];

    return await callGeminiApi(parts);
  } catch (err) {
    console.error('Error in multimodal PDF summarization, falling back to metadata:', err);
    // Fallback: summarize using title and notes if reading file fails
    const prompt = `You are an expert AI document summarizer. Summarize this PDF document in a concise paragraph (maximum 3 to 4 sentences) based on its title and the user's notes.
    
Document Title: ${title}
User's Personal Notes: ${notes || 'None'}`;
    return await callGeminiApi([{ text: prompt }]);
  }
};

/**
 * Generate Smart Tags for PDF Document using Gemini Multimodality
 */
export const generatePdfTags = async (fileUrlPath, title, notes) => {
  try {
    const fileName = fileUrlPath.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    const pdfBuffer = fs.readFileSync(filePath);
    const base64Data = pdfBuffer.toString('base64');

    const parts = [
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data
        }
      },
      {
        text: `Analyze this PDF document and generate 3 to 6 highly relevant, specific, lowercase tags. Return ONLY a JSON array of strings (e.g. ["guide", "reference", "ai"]). Do not include markdown code block formatting or any explanation.
        
Document Title: ${title}
User's Personal Notes: ${notes || 'None'}`
      }
    ];

    const resultText = await callGeminiApi(parts, 'application/json');
    return JSON.parse(resultText.trim());
  } catch (err) {
    console.error('Error in PDF tag generation, falling back to metadata:', err);
    const prompt = `Analyze this PDF document's title and user notes to generate 3 to 6 highly relevant, specific, lowercase tags. Return ONLY a JSON array of strings.
    
Document Title: ${title}
User's Personal Notes: ${notes || 'None'}`;
    try {
      const resultText = await callGeminiApi([{ text: prompt }], 'application/json');
      return JSON.parse(resultText.trim());
    } catch (e) {
      return ['pdf', 'document'];
    }
  }
};
