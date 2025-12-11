export function DetailedExample() {
      return `
    Additionally, provide detailed comments for each change, following the structure below:

  Examples:
  feat: ✨ add validation to the form
      - Add required field validation
      - Implement visual feedback for errors
  fix: 🐞 fix login bug
      - resolve authentication issue in older browsers
      - Adjust redirection after login
  style: 💄 adjust colors in the user menu
      - Change the background color of the menu to improve contrast
      - Update the color palette for the light theme
  refactor: ♻️ improve readability of the calculation function
      - Rename variables for greater clarity
      - Split the function into sub-functions for modularity
  docs: 📝 add instructions to the README
        - Update the installation section
        - Add usage examples
  test: ✅ create unit tests for the authentication service
        - Add tests to verify the login flow
        - Implement integration tests for user registration
  chore: 📦 update project dependencies
        - Update packages to the latest versions
        - Remove unused packages
  perf: 🚀 improve performance of the search function
        - Optimize search algorithms to reduce response time
        - Implement caching for frequent results
  config: 🔧 add ESLint configuration
        - Define code style rules
        - Set up scripts for automatic linting
  security: 🔒 fix vulnerability in authentication
        - Implement protection against brute force attacks
        - Update security libraries
  ui: 🎨 improve layout of the login screen
        - Redesign the interface for better usability
        - Add animations for transitions
  remove: 🗑️ remove unused code
        - Eliminate obsolete functions
        - Clean up unnecessary configuration files
    `;
}

export function DefaultExample() {
      return `
  Examples:
  feat: ✨ add validation to the form
  fix: 🐞 fix login bug
  style: 💄 adjust colors in the user menu
  refactor: ♻️ improve readability of the calculation function
  docs: 📝 add instructions to the README
  test: ✅ create unit tests for the authentication service
  chore: 📦 update project dependencies
  perf: 🚀 improve performance of the search function
  config: 🔧 add ESLint configuration
  security: 🔒 fix vulnerability in authentication
  ui: 🎨 improve layout of the login screen
  remove: 🗑️ remove unused code
  `;
}

export function DraftExample() {
      return `
  Examples:
  feat: add validation to the form
  fix: fix login bug
  style: adjust colors in the user menu
  refactor: improve readability of the calculation function
  docs: add instructions to the README
  test: create unit tests for the authentication service
  chore: update project dependencies
  perf: improve performance of the search function
  config: add ESLint configuration
  security: fix vulnerability in authentication
  ui: improve layout of the login screen
  remove: remove unused code
  `;
}
