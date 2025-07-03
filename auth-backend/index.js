const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const base64url = require("base64url");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require("@simplewebauthn/server");
const store = require("./utils/memoryStore.js"); // Import the in-memory store

const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const User = require("./models/user.js"); // Import the User model

const rpName = "MF Bank";
const rpID = "localhost";
const origin = "http://localhost";

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// === Registration Options Route ===
app.post("/register-options", async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: "Missing username" });

  // Use a stable userID (UUID or from DB)
  const userIdString = randomUUID();
  const userIdBuffer = Buffer.from(userIdString, "utf8");

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userIdBuffer, // RAW UUID, not encoded
    userName: username,
    userDisplayName: username,
    timeout: 60000,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "discouraged",
      userVerification: "preferred",
    },
    supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  });
  options.challenge = base64url.encode(options.challenge);
  // Save challenge and user info in memory
  await User.findOneAndUpdate(
    { username },
    {
      username,
      userID: userIdString,
      currentChallenge: options.challenge,
    },
    { upsert: true, new: true }
  );

  // Also encode the user.id (Uint8Array -> base64url string)
  options.user.id = base64url.encode(userIdBuffer);

  console.log(`✅ Generated registration options for ${username}`);
  res.json(options);
});

// === Registration Verification Route ===
app.post("/register-verification", async (req, res) => {
  const { username, attestationResponse } = req.body;
  // const user = store.users.get(username);

  const user = await User.findOne({ username });

  if (!user || !user.currentChallenge) {
    return res
      .status(400)
      .send({ verified: false, error: "User or challenge not found" });
  }

  if (!user || !user.currentChallenge) {
    return res
      .status(400)
      .send({ verified: false, error: "User or challenge not found" });
  }

  try {
    const expectedChallenge = user.currentChallenge; // already base64url string

    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;

    // if (verified && registrationInfo) {
    //   user.credentials.push(registrationInfo);
    // }

    if (verified && registrationInfo) {
      user.credentials.push({
        credentialID: registrationInfo.credentialID,
        publicKey: registrationInfo.credentialPublicKey,
        counter: registrationInfo.counter,
        transports: registrationInfo.transports || [],
      });

      await user.save();
    }

    res.send({ verified });
  } catch (err) {
    console.error("❌ Error during registration verification:", err);
    res.status(400).send({ verified: false });
  }
});
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Auth backend running on http://localhost:${PORT}`);
});
