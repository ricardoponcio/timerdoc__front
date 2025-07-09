# TimerDoc Frontend

TimerDoc is a Document Management System designed to help users register documents, track deadlines, and manage responsibilities. The platform allows users to associate each document with its required completion period, the client requesting the document, and the person responsible for its delivery. This ensures efficient document tracking, accountability, and timely completion for organizations and teams.

This is the frontend application for the TimerDoc platform, built with React, TypeScript, and Chakra UI.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Modern React application using TypeScript
- Responsive UI with Chakra UI
- Document registration and management
- Deadline and responsibility tracking
- Company and user management
- Internationalization (i18n) support
- Docker support for containerized deployment

---

## Project Structure

```
timerdoc__front/
├── public/
│   ├── timerdoc-icon.svg
│   └── timerdoc-logo.png
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── i18n/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── types/
├── .env
├── Dockerfile
├── package.json
├── tsconfig.json
└── ...
```

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and update variables as needed.

3. **Start the development server:**
   ```sh
   npm run dev
   ```

---

## Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the project for production
- `npm run test` – Run tests

See all scripts in [package.json](./package.json).

---

## Configuration

- Environment variables are managed via `.env`.
- Additional configuration files are in the project root.

---

## Testing

- Tests are written with [Vitest](https://vitest.dev/).
- Run all tests:
  ```sh
  npm test
  ```

---

## Contributing

Pull requests are welcome! Please lint and test your code before submitting.

---

## License

This project is **UNLICENSED**. See [package.json](./package.json) for details.

## References

- [Main Project](https://github.com/ricardoponcio/TimerDoc)