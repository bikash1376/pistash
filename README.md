# API Client

## Overview
This project is a basic implementation of an API client. It allows users to send HTTP requests to various endpoints, view responses, and manage request headers and body data. The client supports multiple HTTP methods (GET, POST, PUT, DELETE) and provides a user-friendly interface for interacting with APIs. Additionally, it includes a scraping feature to extract data from web pages.

## Features
- Send HTTP requests with customizable headers and body data
- View and parse JSON and HTML responses
- Manage and save request configurations
- Basic error handling and response status display
- Scrape web pages to extract data

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express
- **Styling:** CSS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bikash1376/pistash
   cd api-client
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Running the Project
1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5000` to access the API client.

## Usage
- Enter the URL you want to send a request to.
- Select the HTTP method (GET, POST, PUT, DELETE).
- Add headers and body data as needed.
- Click "Send" to execute the request and view the response.
- Use the scraping feature to extract data from web pages by enabling "Scrape Mode" and entering the URL.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
