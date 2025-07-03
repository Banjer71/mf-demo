# 🧬 Fingerprint Login App (Microfrontend + Docker)

This project is a full-stack microfrontend demo using WebAuthn for fingerprint or PIN-based authentication. It's fully Dockerized and includes:

- ⚛️ **React microfrontends** (Host + Remote)
- 🟢 **Node.js Express backend**
- 🗄️ **MongoDB** for credential storage
- 🌐 **NGINX reverse proxy**
- 🐳 **Docker Compose** to run the full stack

---

## 🗂 Project Structure

host/ # Host React App
remote/ # Remote React App
auth-backend/ # Express backend with WebAuthn
nginx/ # NGINX reverse proxy
docker-compose.yml

🗃 MongoDB
MongoDB runs as a container and stores data in a local Docker volume.

🔐 Auth
Supports WebAuthn with fingerprint or PIN registration and login.
