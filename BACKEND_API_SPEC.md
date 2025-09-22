# Backend API Spec (from frontend usage)

Derived from the current frontend code at `src/lib/api.ts`. Implement these endpoints and payloads so the app works without frontend changes. JWT Bearer is required for protected routes.

Base

- Base URL currently used: `https://room-booking-pjo6.onrender.com/api`
- Content-Type: `application/json` (except file uploads)
- Auth header on protected routes: `Authorization: Bearer <access>`

Authentication

1. POST `/auth/jwt/login/`

- Body: { "username": string, "password": string }
- 200: { "access": string, "refresh": string, "user?": object }
- 400/401: { "detail"?: string, "message"?: string }

2. POST `/auth/register/`

- Body: { "username": string, "email": string, "mobile_no": string, "password": string, "confirm_password": string }
- 200: { "message": string, "user?": object }
- 400: { "detail"?: string }

3. POST `/auth/verify/`

- Headers: Authorization
- Body: { "token": string } (same value as access token)
- 200 OK if valid (frontend checks only HTTP status)

4. POST `/auth/logout/`

- Body: { "refresh": string }
- 200 OK (frontend clears tokens regardless of response)

5. GET `/auth/users/me/`

- Headers: Authorization
- 200: user object (any shape). Non-2xx -> frontend may fallback to cached user

Rooms

1. GET `/rooms`

- Query (all optional):
  - `location`: string
  - `check_in`: YYYY-MM-DD
  - `check_out`: YYYY-MM-DD
  - `guests`: number
  - `min_price`: number
  - `max_price`: number
  - `room_type`: string
  - `amenities`: repeat param (e.g. &amenities=WiFi&amenities=Pool)
- 200: Room[] or { data: Room[] }

2. GET `/rooms/{id}`

- 200: Room

3. POST `/rooms` (admin)

- Headers: Authorization
- Body: Partial<Room> (e.g. name, type, price, images, amenities, description, location, max_guests, bedrooms, bathrooms, size, available)
- 201: Room

4. PUT `/rooms/{id}` (admin)

- Headers: Authorization
- Body: Partial<Room>
- 200: Room

5. DELETE `/rooms/{id}` (admin)

- Headers: Authorization
- 200: { message?: string } or deleted Room

Room shape expected by UI (snake_case or camelCase accepted for max_guests):

- id: string
- name: string
- type: string
- price: number
- rating: number
- reviews: number
- images: string[]
- amenities: string[]
- description: string
- location: string
- max_guests: number (or maxGuests)
- bedrooms: number
- bathrooms: number
- size: number
- available: boolean
- createdAt?: string
- updatedAt?: string

Bookings

1. POST `/bookings`

- Headers: Authorization
- Body: {
  roomId: string,
  checkIn: string (YYYY-MM-DD),
  checkOut: string (YYYY-MM-DD),
  guests: number,
  guestInfo: { name: string, email: string, phone: string }
  }
- 201: Booking

2. GET `/bookings` (admin)

- Headers: Authorization
- 200: Booking[] or { data: Booking[] }

3. PATCH `/bookings/{id}/status` (admin)

- Headers: Authorization
- Body: { status: "pending" | "confirmed" | "cancelled" | "completed" }
- 200: Booking

Booking shape:

- id: string
- roomId: string
- checkIn: string
- checkOut: string
- guests: number
- totalPrice: number
- status: "pending" | "confirmed" | "cancelled" | "completed"
- guestInfo: { name: string, email: string, phone: string }
- createdAt: string
- updatedAt: string
- room?: Room

Uploads

1. POST `/upload/images` (admin)

- Headers: Authorization
- Content-Type: multipart/form-data
- Form field: images (multiple)
- 200: { urls: string[] } or { data: { urls: string[] } }

Errors

- Use appropriate status codes; return { detail?: string, message?: string } so UI can display messages.

Notes

- Frontend tolerates either raw arrays/objects or { data: ... } wrappers; prefer raw arrays/objects.
- Supabase is not used by this frontend path; it expects this REST API.
- Ensure CORS allows the frontend origin.
