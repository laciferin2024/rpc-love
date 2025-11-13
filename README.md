# RPC Love: Chain.Love Submitter
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/laciferin2024/rpc-love)
RPC Love is a sophisticated, frontend-only web application designed to streamline the process of adding and updating RPC endpoints to the Chain.Love GitHub repository. It provides a guided, multi-step user experience, eliminating manual forks, edits, and pull requests. The application authenticates users via GitHub OAuth, fetches live RPC data from CSV files in the repository, and presents it in a clean, readable format. A wizard-like form guides the user through providing RPC details, with robust client-side validation. Upon submission, the application leverages the GitHub REST API to automatically fork the repository (if needed), create a new branch, commit the updated CSV files, and open a pull request for review. The entire process is executed client-side, with no backend services, offering a secure and efficient workflow for contributors.
## Key Features
-   **GitHub OAuth Authentication**: Securely sign in with your GitHub account to get started.
-   **Live Data Preview**: View the latest RPC network offerings and provider lists directly from the Chain.Love repository.
-   **Guided Submission Form**: An intuitive, multi-step wizard simplifies the process of adding or updating RPC entries.
-   **Client-Side Validation**: Robust, real-time validation ensures data integrity before submission.
-   **Automated GitHub Workflow**: Automatically handles forking, branching, committing file changes, and opening pull requests.
-   **100% Frontend**: The entire application runs in the browser with no backend services required, ensuring user data privacy and simplicity.
## Technology Stack
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS, shadcn/ui
-   **State Management**: Zustand
-   **Forms**: React Hook Form with Zod for validation
-   **GitHub Integration**: Octokit.js
-   **CSV Parsing**: PapaParse
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Cloudflare Pages & Workers
## Getting Started
Follow these instructions to get a local copy up and running for development and testing purposes.
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) (v1.0 or later)
-   A GitHub account and a configured GitHub OAuth Application.
### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/rpc-love.git
    cd rpc-love
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your GitHub OAuth App's Client ID. You can create an OAuth App in your GitHub developer settings. The callback URL should be your development server URL (e.g., `http://localhost:3000`).
    ```env
    # .env
    VITE_GITHUB_CLIENT_ID="Ov23liPmRr7sw9RQpJYw"
    ```
4.  **Run the development server:**
    ```bash
    bun dev
    ```
The application should now be running on `http://localhost:3000`.
## Usage
Once the application is running, you can:
1.  Navigate to the home page to view the current RPC lists.
2.  Click "Sign in with GitHub" to authenticate.
3.  Click "Add RPC" to open the submission form.
4.  Follow the steps in the wizard to fill in the provider and network details.
5.  On the final step, review your changes.
6.  Click "Submit" to automatically create a branch and open a pull request in the Chain.Love repository.
## Development
### Available Scripts
-   `bun dev`: Starts the development server.
-   `bun build`: Builds the application for production.
-   `bun lint`: Lints the codebase using ESLint.
-   `bun deploy`: Builds the app and deploys it to Cloudflare.
### Project Structure
-   `src/`: Contains all the frontend application code.
    -   `components/`: Reusable React components, including shadcn/ui components.
    -   `pages/`: Top-level page components corresponding to application routes.
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Utility functions and libraries.
    -   `store/`: Zustand state management stores.
-   `worker/`: Contains the Cloudflare Worker code for serving the application.
## Deployment
This project is configured for easy deployment to Cloudflare.
### Deploy with Wrangler CLI
1.  **Login to Wrangler:**
    ```bash
    bunx wrangler login
    ```
2.  **Run the deploy script:**
    ```bash
    bun deploy
    ```
    This command will build the Vite application and deploy it using the configuration in `wrangler.jsonc`.
### Deploy with the "Deploy to Cloudflare" Button
You can also deploy this repository directly to your Cloudflare account by clicking the button below.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/laciferin2024/rpc-love)
## Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
## License
This project is licensed under the MIT License. See the `LICENSE` file for details.