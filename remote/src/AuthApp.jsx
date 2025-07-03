import React, { useState } from "react";
import { FaFingerprint } from "react-icons/fa";

function base64urlToBuffer(base64url) {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(base64url.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const AuthApp = () => {
  const [status, setStatus] = useState("Waiting to register...");
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const registerWithFingerprint = async () => {
    if (!username) {
      setStatus("❌ Please enter a username first.");
      return;
    }

    setStatus("🔄 Fetching registration options from backend...");

    try {
      const res = await fetch("http://localhost:4000/register-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const options = await res.json();

      options.challenge = base64urlToBuffer(options.challenge);
      options.user.id = base64urlToBuffer(options.user.id);
      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map((cred) => ({
          ...cred,
          id: base64urlToBuffer(cred.id),
        }));
      }
      const decodeBase64 = base64urlToBuffer;

      // Decode only if the value is a string
      if (typeof options.challenge === "string") {
        options.challenge = decodeBase64(options.challenge);
      }

      console.log("Received registration options:", options);

      if (!options.user || !options.user.id) {
        console.error("Registration options missing `user.id`");
        return;
      }

      if (typeof options.user.id === "string") {
        options.user.id = decodeBase64(options.user.id);
      }

      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      setStatus("✅ Fingerprint registered locally, sending to backend...");

      const attestationResponse = {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
          attestationObject: bufferToBase64url(
            credential.response.attestationObject
          ),
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      };

      const verifyRes = await fetch(
        "http://localhost:4000/register-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, attestationResponse }),
        }
      );

      const result = await verifyRes.json();

      if (result.verified) {
        setStatus("🎉 Registration successful!");
        setIsRegistered(true);
      } else {
        setStatus("❌ Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error during registration.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔐 Register with Fingerprint</h2>
      <FaFingerprint style={styles.icon} size={96} />

      <input
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        style={styles.button}
        onClick={registerWithFingerprint}
        disabled={isRegistered}
      >
        Register Fingerprint
      </button>

      <p>{status}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    border: "2px dashed #ccc",
    borderRadius: "12px",
    width: "320px",
    margin: "2rem auto",
    backgroundColor: "#f7f9fa",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  icon: {
    color: "#007bff",
    margin: "1rem 0",
  },
  input: {
    padding: "0.6rem",
    fontSize: "1rem",
    marginBottom: "1rem",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AuthApp;
