# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0]
### Added
- **Google AI Integration**: Added support for Google's Gemini models as a new provider for generating commit messages.
- **Dynamic Model Selection**: The extension now dynamically fetches available Google AI models, allowing the user to choose a new one if the configured model is not found.
- **Simplified Provider Switching**: It is now possible to switch between LM Studio and Google AI directly from error messages if a provider is not configured correctly.

### Changed
- **Rebranded to "Commit Wizard Pro"**: The extension name was changed from "Commit Wizard Local" to "Commit Wizard Pro" to reflect support for both local and cloud-based AI models.
- **Updated Settings**: Configuration options were updated to include the Google API key and model selection.
- **Improved User Experience**: The error handling flow was enhanced to guide the user in setting up the API key or selecting a valid model.

## [1.0.8]
### Added
- **Automatic Diff Summarization**: For very large diffs, the extension now automatically generates a summary to avoid token limits and provide better context to the AI model.

## [1.0.7]
### Changed
- Updated and formatted the changelog.

## [1.0.6]
### Fixed
- Addressed an issue with generating commit messages for very large diffs by implementing a size limit.
- Improved error handling for LM Studio integration.

### Changed
- Enhanced automatic detection of the active repository.
- Improved user experience for model selection and notifications.
- Updated dependencies and minor stability improvements.

## [1.0.5]
### Added
- The extension now automatically detects the active repository based on the currently open file.

## [1.0.3]
### Changed
- Updated `CHANGELOG.md` and `README.md`.

## [1.0.2]
### Added
- Added support for older VS Code versions (down to 1.100.x).

## [1.0.1]
### Added
- Added the extension logo.

## [1.0.0]
### Added
- First stable version with automatic commit message suggestions.
