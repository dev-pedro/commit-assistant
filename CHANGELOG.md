# Changelog
## [1.0.8] - 2025-10-01
#### Added
- Automatic summary of large diffs: Now, when generating commit messages, if the diff is too large, it is automatically summarized (changed files, added/removed lines, and relevant snippets), avoiding template overload and maintaining the sense of the commit.

---
## [1.0.7] - 2025-09-03
- Changelog updated

## [1.0.6] - 2025-09-03

- Fixed issue when generating commit messages with very large diffs (diff size is now limited to prevent errors).
- Improved error handling for local model integration via LM Studio.
- Enhanced automatic repository and active file selection.
- Better user experience for model selection and notifications.
- Updated dependencies and minor stability improvements.

### [1.0.5] - 2025-09-01
#### Added
- Automatically detect the active repository based on the current file

### [1.0.3] - 2025-08-30
#### Doc
- Updated changelog.
- Updated readme.
### [1.0.2] - 2025-08-30
#### Added
- Support for older versions of VS Code (1.100.x).

### [1.0.1] - 2025-08-30
#### Chore
- Added extension logo.

### [1.0.0] - 2025-08-29
#### 1.0.0
- First stable version with automatic commit message suggestions.
