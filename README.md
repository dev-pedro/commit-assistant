# Commit Wizard Pro

Automatically generate clear and concise commit messages for your Git changes using local or cloud-based AI models integrated with VS Code.

## Features
- Automatic suggestion of commit messages based on repository changes.
- Support for both local models via LM Studio and cloud-based models via Google AI (Gemini).
- Dynamic selection of available models.
- Choice of message style (`default`, `detailed`, `draft`).
- Configurable notifications for quick feedback.
- Support for commit messages in multiple languages (`en`, `pt`).
- User-friendly interface integrated with VS Code's SCM.

## Requirements
- For local models: LM Studio installed and running.
- For cloud models: A Google AI API Key for Gemini models.
- Node.js and npm installed for development.
- Git installed and repository opened in VS Code.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/dev-pedro/commit-assistant.git
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Compile the extension:
   ```sh
   npm run compile
   ```
4. Start LM Studio and load the desired model(s).
5. Run and test the extension in VS Code (press F5 for development mode).

## How to Use
- Open the SCM (source control) menu in VS Code.
- Click the "Generate Commit Suggestion" button or run the command `Commit Assistant: Generate Commit Suggestion`.
- If you have multiple models configured, you may be prompted to choose one.
- The suggested message will be automatically inserted into the commit field.

## Settings
The extension offers the following options in `settings.json`:
- `CommitAssistant.ApiProvider`: API provider to use (`LM Studio` or `Google`).
- `CommitAssistant.ApiKey`: Your Google API Key for Gemini.
- `CommitAssistant.googleModel`: The Google model for generating commit messages.
- `CommitAssistant.LocalModel`: The local model used for commit suggestions via LM Studio.
- `CommitAssistant.MessageStyle`: Message style (`default`, `detailed`, `draft`).
- `CommitAssistant.enableNotifications`: Enable/disable notifications.
- `CommitAssistant.CommitIdiom`: Language for the commit message (`en`, `pt`).

## Examples
- Commit suggestion
![Commit suggestion](/images/message-commit.png)
- Model selection
![Model selection](/images/select-model.png)

## Known Issues
- The command "Show Commit Assistant Settings" needs to be implemented to function correctly.
- Ensure that LM Studio is running and models are loaded.

## Changelog

Follow the changes in each version in [CHANGELOG.md](./CHANGELOG.md).

---
For questions or suggestions, please open an issue on [GitHub](https://github.com/dev-pedro/commit-assistant).
