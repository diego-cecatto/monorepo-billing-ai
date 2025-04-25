## API Folder Structure (tRPC + Clean Architecture Inspired)

```
api/
├── src/
│   ├── config/                # Configuration (env, constants)
│   │   └── index.ts
│   │
│   ├── clients/               # Third-party API clients (e.g., OpenAI)
│   │   └── openaiClient.ts
│   │
│   ├── services/              # Business logic / service layer
│   │   └── analyzeService.ts
│   │
│   ├── router/                # tRPC router definitions
│   │   ├── analyze.ts         # tRPC procedure for composition analysis
│   │   └── index.ts           # root tRPC router
│   │
│   ├── context/               # tRPC context (e.g., config, clients)
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions (formatting, logging)
│   │   └── logger.ts
│   │
│   ├── types/                 # Shared TypeScript types and interfaces
│   │   └── composition.ts
│   │
│   └── server.ts              # App setup: tRPC + HTTP server (Express/Vite)
│
├── tests/                     # Unit and integration tests
│   └── services/
│       └── analyzeService.test.ts
│
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts             # if using Vite for backend
```
