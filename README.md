# AI-Powered Form Generator

This project is an advanced AI-powered form generator that creates customized forms based on user descriptions. It features a sleek gradient background, theme support, and a comprehensive dashboard for form management.

## Features

- AI-powered form structure generation
- User-friendly interface with gradient background and theme support
- Dashboard for easy form management
- Real-time form editing and preview
- Integration with Clerk for user authentication
- PostgreSQL database for robust data storage
- JSX for dynamic component rendering

## Technologies Used

- Next.js
- React
- javascript
- Tailwind CSS
- CSS
- Daisy UI
- Google Generative AI (Gemini 1.5 Flash)
- Clerk (for authentication)
- PostgreSQL (with Drizzle ORM)
- Moment.js for date handling
- React Hot Toast for notifications
- Custom theming system


## Usage

1. Log in to access the dashboard
2. Click on the "Create Form" button to open the form creation dialog
3. Enter a description of the form you want to create
4. Click "Create" to generate the form structure using AI
5. The generated form will be saved to the database
6. Use the dashboard to view, edit, or delete your forms

## Project Structure

- `components/`: Contains UI components like Dialog, Button, and Textarea
- `configs/`: Configuration files including database setup and AI model configuration
- `pages/`: Next.js pages for routing, including the dashboard
- `styles/`: Theme configurations and global styles
- `lib/`: Database models and utility functions
- `CreateForm.js`: Main component for form creation
- `EditForm.js`: Component for editing existing forms

## AI Model Configuration

The AI model (Gemini 1.5 Flash) is configured with the following parameters:

```javascript
const generationConfig = {
temperature: 0.7,
topP: 1,
topK: 1,
maxOutputTokens: 2048,
};


