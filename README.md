# snippetlab

**Version 0.1.0**

A simple CLI tool to download code snippets by `user/slug` identifier from the SnippetLab API and save them to disk or stdout.

## Features

- Download a snippet by `user/slug`.
- Automatically detect file name from HTTP `Content-Disposition` header.
- Support for custom output path with automatic directory creation.
- Default API base URL is hardcoded for zero‑configuration installation.

## Installation

Install globally with npm or pnpm:

```bash
npm install -g snippetlab
# or
pnpm add -g snippetlab
```

## Usage

```bash
snippetlab add <user/slug> [output] [--base-url <url>]
```

- `<user/slug>`: required. Snippet identifier, e.g. `aaron/usetoggle-hook`.
- `[output]`: optional. File path to save the snippet. If omitted:

  - When running in a TTY, saves as the file name provided by the API header.
  - When redirecting stdout (`>`), writes raw content to stdout.

- `--base-url`, `-b`: optional. Override default API base URL (defaults to `https://snippetlab.app`).

### Examples

1. **Save using header filename** (TTY mode):

   ```bash
   snippetlab add aaron/test-snippet
   # Creates file `test.js` in current directory
   ```

2. **Redirect to custom file**:

   ```bash
   snippetlab add aaron/usetoggle-hook > code/index.ts
   # Writes raw content to stdout, redirected into `code/index.ts`
   ```

3. **Specify output path**:

   ```bash
   snippetlab add aaron/usetoggle-hook myHooks/useToggle.ts
   # Creates `myHooks/useToggle.ts`, creating `myHooks/` if needed
   ```

4. **Use local development server**:

   ```bash
   snippetlab add aaron/test-snippet --base-url http://localhost:3000 > demo.js
   ```

## Configuration

| Option       | Description                      | Default                  |
| ------------ | -------------------------------- | ------------------------ |
| `--base-url` | API base URL for snippet service | `https://snippetlab.app` |

## Development

1. Clone the repo:

   ```bash
   git clone [https://github.com/aaronperezaguilera/snippetlab.git](https://github.com/aaronperezaguilera/snippetlab.git)
   cd snippetlab
   ```

````

2. Install dependencies:
   ```bash
npm install
````

3. Link locally for testing:

   ```bash
   npm link
   ```

````


4. Run in local dev mode:
   ```bash
snippetlab add aaron/test-snippet --base-url http://localhost:3000
````

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feat/my-feature`.
3. Commit your changes: `git commit -m "feat: add my feature"`.
4. Push to your fork: `git push origin feat/my-feature`.
5. Open a pull request.
