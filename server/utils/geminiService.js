import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ENHANCE_PROMPT = `Improve clarity, organize with headings and lists, correct grammar, expand ~20–30%\nwithout fabricating facts, preserve terminology, output HTML content only.`;

/**
 * Enhances the given content using Gemini API.
 * @param {string} content - The content to enhance.
 * @returns {Promise<string>} - Enhanced content in markdown.
 */
export async function enhanceContent(content) {
	if (!GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY is not set in environment variables');
	}
	try {
		const response = await axios.post(
			`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
			{
				contents: [
					{
						parts: [
							{ text: `${ENHANCE_PROMPT}\n\n${content}` }
						]
					}
				]
			}
		);
		// Extract markdown output from Gemini response
		const markdown = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
		return markdown;
	} catch (error) {
		throw new Error('Failed to enhance content: ' + error.message);
	}
}

