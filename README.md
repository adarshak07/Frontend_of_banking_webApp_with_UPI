# MyBank Frontend (React)
This frontend is matched to your Spring Boot backend routes:

- POST `/auth/register` { name, phone, email, password }
- POST `/auth/login` { email, password } -> returns `{ token }` wrapped in `ResponseModel`
- GET `/profile` -> { name, email, phone }
- GET `/accounts` -> [{ card_number, cvv, balance }]
- POST `/transaction/deposit` { card_number, amount }
- POST `/transaction/withdraw` { card_number, cvv, amount }

## Run (dev)
```bash
cd frontend
npm install
npm start
```
Open http://localhost:3030

- Dev proxy sends API requests to `http://localhost:8080` to avoid CORS.
- JWT is stored in `localStorage` as `token` and sent as `Authorization: Bearer <token>`.
