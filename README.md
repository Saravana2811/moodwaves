# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Connecting MongoDB Compass / local backend to MongoDB Atlas

1. Create a free Atlas cluster at https://www.mongodb.com/cloud/atlas and create a database user (username + password).
2. In Atlas → Network Access, add your IP address (or temporarily add 0.0.0.0/0 for quick testing).
3. In Atlas → Clusters → Connect → Connect your application, copy the "mongodb+srv://" connection string and replace `<username>`, `<password>` and `<dbname>`.

Example connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/moodtunes?retryWrites=true&w=majority
```

4. Set that string as the MONGO_URI for the backend:
   - Create a file at backend/.env (not committed) with:
     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/moodtunes?retryWrites=true&w=majority
     ```
   - Or export it in your shell: `export MONGO_URI="mongodb+srv://..."`
5. Start the backend:
   - cd backend
   - npm install
   - npm run dev
6. Optionally, open MongoDB Compass and paste the same connection string (use the "Fill in connection fields individually" if needed).

Notes
- The backend already reads process.env.MONGO_URI and falls back to a local MongoDB URI if not present.
- If connection fails, the backend will log helpful hints (missing MONGO_URI, IP whitelist, credentials).
