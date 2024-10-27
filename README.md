
---

# Marvel API with Redis Caching

## Description
This project creates an Express.js server that interfaces with the Marvel API to fetch information on Marvel characters, comics, and stories. It caches API responses in Redis, checking for cached data before each request to optimize performance. The API provides JSON responses and uses asynchronous handling for improved efficiency.

## Features
- **Redis Caching**: Stores API responses to reduce redundant calls, ensuring faster responses for frequently accessed data.
- **Character, Comic, and Story Routes**: Retrieve information on specific characters, comics, and stories with Redis-enabled caching.
- **Recently Accessed Character History**: Maintains a list of the last 20 accessed characters with full detail retrieval.
- **Data Validation & Error Handling**: Handles errors and validates API responses, ensuring robust functionality.

## Tech Stack
- Node.js
- Express.js
- Redis
- REST API

## API Endpoints
### Characters
- `GET /api/characters/:id`: Retrieve specific character data, checking Redis cache first.
- `GET /api/characters/history`: Retrieve the last 20 characters accessed.

### Comics
- `GET /api/comics/:id`: Retrieve specific comic data, checking Redis cache first.

### Stories
- `GET /api/stories/:id`: Retrieve specific story data, checking Redis cache first.

## Installation
1. Clone the repository.
   ```bash
   git clone https://github.com/sachindevangan/Marvel-API-with-Redis-Caching
   ```
2. Navigate to the project directory.
   ```bash
   cd marvel-api
   ```
3. Install the dependencies.
   ```bash
   npm install
   ```
4. Register for a Marvel API key [here](https://developer.marvel.com/account) and configure it in the project (e.g., in a `.env` file).
5. Start the Redis server.
6. Start the API server.
   ```bash
   npm start
   ```

## Usage
- Use tools like Postman to test API endpoints.
- Refer to **API Endpoints** for route specifications.

## License
This project is licensed under the MIT License.