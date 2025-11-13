# RPC Love: Chain.Love Submitter

RPC Love is a sophisticated, frontend-only web application designed to streamline the process of adding and updating RPC endpoints to the Chain.Love GitHub repository. It provides a guided, multi-step user experience, eliminating manual forks, edits, and pull requests. The application authenticates users via GitHub OAuth, fetches live RPC data from CSV files in the repository, and presents it in a clean, readable format. A wizard-like form guides the user through providing RPC details, with robust client-side validation. Upon submission, the application leverages the GitHub REST Contents API to automatically fork the repository (if needed), create a new branch, commit the updated CSV files, and open a pull request for review. The entire process is executed client-side, with no backend services, offering a secure and efficient workflow for contributors.

**Note**: The MVP is currently focused on the Filecoin network. The network selector is fixed to Filecoin in the top navigation bar.

## Key Features

- **GitHub OAuth Authentication**: Securely sign in with your GitHub account using public client OAuth with repo scope for fork updates and PR creation.
- **Live Data Preview**: View the latest Filecoin RPC entries and registered RPC providers directly from the Chain.Love repository:
  - `networks/filecoin/rpc.csv` - Current Filecoin RPC offerings (read-only preview)
  - `providers/rpc.csv` - Registered RPC provider registry (read-only preview)
- **Guided Multi-Step Submission Form**: An intuitive wizard that guides you through:
  - Step 1: Choose or create a provider (select existing or create new provider with name and slug)
  - Step 2: Network RPC details (slug, plan, nodeType, chain, pricing, APIs, action buttons, and optional flags)
- **Review & Submit**: Preview side-by-side diffs for both CSV files before submission, with editable commit messages and PR metadata.
- **Client-Side Validation**: Robust, real-time validation ensures data integrity including required fields, URL formats, slug uniqueness, and character limits.
- **Automated GitHub Workflow**: Automatically handles:
  - Fork creation (if needed)
  - Branch creation on your fork
  - Sequential updates to `providers/rpc.csv` and `networks/filecoin/rpc.csv` via GitHub REST Contents API
  - Pull request creation from your fork to `Chain-Love/chain-love` main branch
- **100% Frontend**: The entire application runs in the browser with no backend services or serverless functions required, ensuring user data privacy and simplicity.

## Technology Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod for validation
- **GitHub Integration**: GitHub REST Contents API (via Octokit.js or fetch) for fork management, file updates, and PR creation
- **CSV Parsing**: PapaParse (or similar robust CSV library) for parsing and serialization with RFC4180 compliance
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Usage

### First-time Use Flow

1.  **Home Page**:

    - View the Network selector (fixed to Filecoin, disabled)
    - Browse "Current Filecoin RPC entries" from `networks/filecoin/rpc.csv` (read-only, paginated table)
    - Browse "Registered RPC providers" from `providers/rpc.csv` (read-only, compact list with search)
    - Click "Add RPC" to start the submission process

2.  **Authentication**:

    - Click "Sign in with GitHub" in the header to authenticate
    - After authentication, your avatar and a "Sign out" option will appear in the menu

3.  **Add RPC Form**:

    - **Step 1: Choose Provider**
      - Select "Use existing provider" and search by name/slug, OR
      - Select "Create new provider" and provide:
        - Provider name (display name)
        - Provider slug (unique identifier)
    - **Step 2: Network RPC Details**
      - Slug (required, unique per `networks/filecoin/rpc.csv`)
      - Plan (e.g., Free, Pay-as-you-go, Enterprise, Custom)
      - Node Type (e.g., Recent-State, Archive, FEVM Archive)
      - Chain (mainnet or calibnet)
      - Pricing: Access Price and Query Price
      - Available APIs (tags input)
      - Action Buttons (repeatable label + URL pairs)
      - Optional flags: Trial, Starred
    - Click "Save & Continue" to proceed to review

4.  **Review & Submit**:

    - Preview side-by-side diffs for both CSV files:
      - `providers/rpc.csv`: "No change", "1 new row", or "1 updated row"
      - `networks/filecoin/rpc.csv`: "1 new row" or "1 updated row"
    - Review and edit PR metadata:
      - Branch name (pre-filled: `cl-rpc-{slug}-{timestamp}`)
      - Commit message (pre-filled, editable)
      - PR title and body (pre-filled, editable)
    - If a slug already exists, you'll be prompted to confirm overwrite
    - Click "Submit" to create the branch, commit changes, and open a pull request

5.  **Success Page**:
    - View links to:
      - File changes in your fork and branch
      - The pull request (if created)
    - Options to "Add another RPC" or "Back to Home"

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
