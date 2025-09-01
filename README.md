# Commit Assistant - AI Local Models

Automatically generate clear and concise commit messages for your Git changes using local AI models integrated with VS Code.

## Features
- Automatic suggestion of commit messages based on repository changes.
- Support for multiple local models via LM Studio.
- Choice of message style (standard, detailed, draft).
- Configurable notifications for quick feedback.
- User-friendly interface integrated with VS Code's SCM.

## Requirements
- [LM Studio](https://lmstudio.ai/) installed and running locally (default port: 1234).
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
- If there is more than one active model, choose the desired model.
- The suggested message will be automatically inserted into the commit field.

## Settings
The extension offers the following options in `settings.json`:
- `CommitAssistant.localModel`: Default local model for suggestions.
- `CommitAssistant.messageStyle`: Message style (`default`, `detailed`, `draft`).
- `CommitAssistant.enableNotifications`: Enable/disable notifications.
- `CommitAssistant.commitIdiom`: Language of the message (`en`, `pt`).

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

