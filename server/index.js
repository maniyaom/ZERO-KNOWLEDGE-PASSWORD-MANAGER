import crypto from "crypto";
import argon2 from "argon2";
import express from "express";
import cors from "cors";

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/

const POLICY = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
};

const LOWER = "abcdefghijklmnopqrstuvwxyz";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NUMBERS = "0123456789";

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?/`~";

/*
|--------------------------------------------------------------------------
| NORMALIZATION
|--------------------------------------------------------------------------
*/

function normalize(value) {
  return value.trim().toLowerCase();
}

/*
|--------------------------------------------------------------------------
| ARGON2ID SEED GENERATION
|--------------------------------------------------------------------------
|
| This is the MOST IMPORTANT part.
|
| We derive a deterministic cryptographic seed from:
| - master password
| - service
| - identifier
| - counter
|
| Same inputs => same seed
|--------------------------------------------------------------------------
*/

async function deriveSeed({
  masterPassword,
  service,
  identifier,
  counter = 1,
}) {
  const normalizedService = normalize(service);

  const normalizedIdentifier = normalize(identifier);

  const context = `${normalizedService}|${normalizedIdentifier}|${counter}`;

  const contextHash = crypto.createHash("sha512").update(context).digest();


  const seed = await argon2.hash(masterPassword, {
    type: argon2.argon2id,

    salt: contextHash,

    raw: true,

    hashLength: 64,

    memoryCost: 65536,

    timeCost: 3,

    parallelism: 1,
  });

  return seed;
}

/*
|--------------------------------------------------------------------------
| DETERMINISTIC PRNG
|--------------------------------------------------------------------------
|
| Expands seed into unlimited deterministic random bytes.
|--------------------------------------------------------------------------
*/

function createPRNG(seed) {
  let counter = 0;

  return function getBytes(length) {
    const output = Buffer.alloc(length);

    let generated = 0;

    while (generated < length) {
      const hmac = crypto.createHmac("sha512", seed);

      hmac.update(Buffer.from(counter.toString()));

      const chunk = hmac.digest();

      const remaining = length - generated;

      const toCopy = Math.min(remaining, chunk.length);

      chunk.copy(output, generated, 0, toCopy);

      generated += toCopy;

      counter++;
    }

    return output;
  };
}

/*
|--------------------------------------------------------------------------
| RANDOM CHARACTER PICKER
|--------------------------------------------------------------------------
*/

function pickCharacter(byte, charset) {
  return charset[byte % charset.length];
}

/*
|--------------------------------------------------------------------------
| DETERMINISTIC FISHER-YATES SHUFFLE
|--------------------------------------------------------------------------
*/

function deterministicShuffle(array, bytes) {
  const arr = [...array];

  let byteIndex = 0;

  for (let i = arr.length - 1; i > 0; i--) {
    const j = bytes[byteIndex] % (i + 1);

    [arr[i], arr[j]] = [arr[j], arr[i]];

    byteIndex++;
  }

  return arr;
}

/*
|--------------------------------------------------------------------------
| MAIN PASSWORD GENERATOR
|--------------------------------------------------------------------------
*/

async function generatePassword({
  masterPassword,
  service,
  identifier,
  counter = 1,
  length = PASSWORD_LENGTH,
}) {
  const seed = await deriveSeed({
    masterPassword,
    service,
    identifier,
    counter,
  });

  const getBytes = createPRNG(seed);

  const password = [];

  let combinedCharset = "";

  /*
  |--------------------------------------------------------------------------
  | ENSURE POLICY REQUIREMENTS
  |--------------------------------------------------------------------------
  */

  if (POLICY.lowercase) {
    combinedCharset += LOWER;

    const byte = getBytes(1)[0];

    password.push(pickCharacter(byte, LOWER));
  }

  if (POLICY.uppercase) {
    combinedCharset += UPPER;

    const byte = getBytes(1)[0];

    password.push(pickCharacter(byte, UPPER));
  }

  if (POLICY.numbers) {
    combinedCharset += NUMBERS;

    const byte = getBytes(1)[0];

    password.push(pickCharacter(byte, NUMBERS));
  }

  if (POLICY.symbols) {
    combinedCharset += SYMBOLS;

    const byte = getBytes(1)[0];

    password.push(pickCharacter(byte, SYMBOLS));
  }

  /*
  |--------------------------------------------------------------------------
  | FILL REMAINING CHARACTERS
  |--------------------------------------------------------------------------
  */

  const remaining = length - password.length;

  const randomBytes = getBytes(remaining);

  for (let i = 0; i < remaining; i++) {
    password.push(pickCharacter(randomBytes[i], combinedCharset));
  }

  /*
  |--------------------------------------------------------------------------
  | DETERMINISTIC SHUFFLE
  |--------------------------------------------------------------------------
  */

  const shuffleBytes = getBytes(password.length);

  const shuffled = deterministicShuffle(password, shuffleBytes);

  return shuffled.join("");
}

const PASSWORD_LENGTH = 16;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-password", async (req, res) => {
  const { masterPassword, service, identifier } = req.body;
  const password = await generatePassword({
    masterPassword,
    service,
    identifier,
    length: PASSWORD_LENGTH,
  });
  res.status(200).json({
    success: true,
    message: "Password generated successfully",
    data: {
      password,
    },
  });
});

app.listen(3000, () => console.log("Server started on port 3000"));