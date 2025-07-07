# 🧬 Fingerprint Login App (Microfrontend + Docker)

This project is a full-stack microfrontend demo using WebAuthn for fingerprint or PIN-based authentication. It's fully Dockerized and includes:

- ⚛️ **React microfrontends** (Host + Remote)
- 🟢 **Node.js Express backend**
- 🗄️ **MongoDB** for credential storage
- 🌐 **NGINX reverse proxy**
- 🐳 **Docker Compose** to run the full stack

---

## 🗂 Project Structure

my-fingerprint-app/
├── docker-compose.yml # Or inside /host if preferred
├── host/ # Host React app
│ └── Dockerfile
├── remote/ # Remote React microfrontend
│ └── Dockerfile
├── auth-backend/ # Node.js backend
│ └── Dockerfile
├── nginx/ # Reverse proxy
│ ├── nginx.conf
│ └── Dockerfile



---

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/fingerprint-app.git
   cd fingerprint-app


🗃 MongoDB
MongoDB runs as a container and stores data in a local Docker volume.
docker exec -it mongo mongosh


🔐 Auth
Supports WebAuthn with fingerprint or PIN registration and login.

🧠 Tech Stack
React: Host and remote apps (Microfrontend architecture)

Express: Backend server

MongoDB: Stores WebAuthn credentials

NGINX: Reverse proxy for routing between services

WebAuthn: Modern browser fingerprint + PIN authentication

Docker Compose: One command to run everything

🛠 Endpoints Overview
/ → Host app

/remote/ → Remote microfrontend

/api/ → Backend API (proxied through NGINX)

/register-options & /register-verification → WebAuthn routes
