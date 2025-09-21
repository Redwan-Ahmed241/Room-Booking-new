# Comprehensive API Documentation

## Authentication API

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token"
}
```

## Rooms API

### Get All Rooms

**GET** `/rooms`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "room_1",
      "name": "Luxury Ocean View Suite",
      "type": "Suite",
      "price": 250,
      "rating": 4.8,
      "reviews": 124,
      "images": ["url1", "url2"],
      "amenities": ["WiFi", "Pool"],
      "description": "Beautiful ocean view suite",
      "location": "London",
      "maxGuests": 4,
      "bedrooms": 2,
      "bathrooms": 2,
      "size": 85,
      "available": true
    }
  ]
}
```

### Create Room (Admin Only)

**POST** `/rooms`

**Request Body:**

```json
{
  "name": "string",
  "type": "string",
  "price": 200,
  "images": ["url1", "url2"],
  "amenities": ["WiFi", "Pool"],
  "description": "string",
  "location": "string",
  "maxGuests": 2,
  "bedrooms": 1,
  "bathrooms": 1,
  "size": 45,
  "available": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "new_room_id",
    "name": "string",
    "type": "string",
    "price": 200,
    "rating": 0,
    "reviews": 0,
    "images": ["url1", "url2"],
    "amenities": ["WiFi", "Pool"],
    "description": "string",
    "location": "string",
    "maxGuests": 2,
    "bedrooms": 1,
    "bathrooms": 1,
    "size": 45,
    "available": true
  }
}
```

### Update Room (Admin Only)

**PUT** `/rooms/:id`

**Request Body:**

```json
{
  "name": "string",
  "price": 300,
  "available": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "room_id",
    "name": "string",
    "price": 300,
    "available": false
  }
}
```

### Delete Room (Admin Only)

**DELETE** `/rooms/:id`

**Response:**

```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

## Bookings API

### Create Booking

**POST** `/bookings`

**Request Body:**

```json
{
  "roomId": "room_1",
  "checkIn": "2024-02-01",
  "checkOut": "2024-02-05",
  "guests": 2,
  "guestInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "booking_1",
    "roomId": "room_1",
    "checkIn": "2024-02-01",
    "checkOut": "2024-02-05",
    "guests": 2,
    "totalPrice": 1000,
    "status": "pending",
    "guestInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }
}
```

### Get All Bookings (Admin Only)

**GET** `/bookings`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "booking_1",
      "roomId": "room_1",
      "checkIn": "2024-02-01",
      "checkOut": "2024-02-05",
      "guests": 2,
      "totalPrice": 1000,
      "status": "confirmed",
      "guestInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      }
    }
  ]
}
```

### Update Booking Status (Admin Only)

**PATCH** `/bookings/:id/status`

**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "booking_1",
    "status": "confirmed"
  }
}
```

## File Upload API

### Upload Images

**POST** `/upload/images`

**Request Body:**

- Form data with `images` field containing multiple files

**Response:**

```json
{
  "success": true,
  "data": {
    "urls": ["url1", "url2"]
  }
}
```

## Admin Statistics API

### Get Dashboard Stats (Admin Only)

**GET** `/admin/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRooms": 25,
    "totalBookings": 150,
    "totalRevenue": 45000,
    "occupancyRate": 75.5
  }
}
```

## Database Schema

### Rooms Table

```sql
CREATE TABLE rooms (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  images JSON,
  amenities JSON,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  max_guests INT NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  size INT NOT NULL,
  available BOOLEAN DEFAULT true
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  guest_info JSON
);
```

## Environment Variables

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=3001
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Example

```json
{
  "success": false,
  "error": "Room not found"
}
```
