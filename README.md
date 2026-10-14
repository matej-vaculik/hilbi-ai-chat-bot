# IQ Assistant

A small, responsive streaming chat built with React, TypeScript, Vite, plain CSS, and Lucide icons. The interface follows the supplied Hilbi brand guide: cyan (`#5BC8E0`), navy (`#2E3A6E`), pink (`#FF4F8B`), text grey (`#5A6072`), white, and light grey surfaces. Body text uses Arial; headings use Roboto with an Arial fallback. The app fills the browser width and keeps its scrollbar at the right edge; messages and composer sit in a centered 760px column. Asclepius is identified as the health AI assistant in the header and welcome screen. A lightweight SVG doctor robot gently floats and blinks, with a static version for reduced motion. Messages omit repeated sender labels; outgoing bubbles have a subtle border and WhatsApp-style tail. A brief divider animation expands from the center on completion and respects reduced motion. No conversation persistence.

## Run

Node.js 22+ is recommended.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

The development and preview servers include the local `/iq` mock. A static `dist/` deployment needs a real `/iq` service; the mock is not included in the browser bundle.

## `/iq` integration

The client retrieves a fresh public key from `GET /iq/key`. The server returns an algorithm identifier and a public RSA JWK. The browser encrypts the current message using a fresh AES-256-GCM key and 12-byte IV, then encrypts that key with RSA-OAEP/SHA-256. The RSA key is 3072 bits. Authenticated additional data is the UTF-8 string `hilbi-iq:v1`.

Only the resulting envelope is sent:

```http
POST /iq
Content-Type: application/json
Accept: application/x-ndjson

{"version":1,"algorithm":"RSA-OAEP-256+A256GCM","wrappedKey":"...","iv":"...","ciphertext":"..."}
```

| Field | What it contains |
| --- | --- |
| `version` | Protocol version, currently `1`. |
| `algorithm` | The encryption methods: RSA-OAEP with SHA-256 and AES-256-GCM. |
| `wrappedKey` | The fresh AES key encrypted using the server's public RSA key. The private RSA key stays on the server. |
| `iv` | A fresh random 12-byte initialization value used by AES-GCM. It is public, not a password or message. |
| `ciphertext` | Encrypted UTF-8 JSON containing the current message, followed by a 16-byte authentication tag for detecting tampering. |

For example, before encryption the browser constructs `{ "message": "Your current text, including any personal details" }`. Leading and trailing whitespace is trimmed; the rest is not redacted. Conversation history, local message IDs, the assistant's name, files, and timestamps are not added to the payload. Request size can reveal the approximate message length.

Before the POST, `GET /iq/key` has no message body and retrieves only public key material. The POST explicitly sets `Content-Type: application/json` and `Accept: application/x-ndjson`. Cookies and referrers are omitted. The server still receives the normal HTTP request and connection metadata, such as source IP, request timing, and browser-generated headers. This metadata is not hidden by encrypting the body.

The last three fields are Base64 representations of encrypted bytes; Base64 itself does not provide protection. `ciphertext` includes a trailing 16-byte GCM authentication tag. The encrypted plaintext is UTF-8 JSON containing only `{ "message": "..." }`. The server rejects plaintext requests, invalid versions, malformed envelopes, failed authentication, and messages exceeding 4,000 characters. Key retrieval or encryption failure never falls back to plaintext. Stop and New chat cancel key retrieval as well as streaming.

Successful responses use `Content-Type: application/x-ndjson; charset=utf-8` and newline-delimited records:

```json
{"type":"token","text":"Let’s "}
{"type":"token","text":"explore that. ✨"}
{"type":"done"}
```

`done` is required; EOF without it is an interrupted response. Tokens may span arbitrary network chunks. The client uses a streaming UTF-8 `TextDecoder`, buffers partial records, and rejects malformed events or unsupported content types. Errors use non-2xx HTTP status codes. Only the current prompt is sent; the service is stateless and the mock does not use chat history.

Replace `dev/iqMock.ts` with your production service implementing both `/iq/key` and the encrypted `/iq` contract. Disable the mock and its UI badge with `IQ_MOCK=false` (PowerShell: `$env:IQ_MOCK='false'`) before running Vite/building. Serve both routes on the same origin or configure development proxies. If the service uses SSE or another format, update `src/services/iqClient.ts` to match its contract.

The demo generates a private key in server memory when it starts; it is never bundled in the browser or saved to disk. Production servers must manage private keys securely and coordinate public key rotation across replicas. HTTPS is required for remote hosts to authenticate the public key and protect the response stream; HTTP is permitted only for loopback development. This is application-layer request encryption, not end-to-end encryption from the service: the server can read the message after decrypting it.

The mock selects among 100 distinct prepared medical education replies using whole-word and phrase keyword matching. Urgent topics take priority and skip the normal two-second pause. Unknown questions receive a neutral symptom-description reply. The catalog and reference notes are in [medical-content.md](medical-content.md). These replies are not clinically validated or personalized medical advice, and keyword matching cannot detect every emergency. The mock is stateless and has no AI provider connection. Manual state checks:

- `/demo error`: HTTP 503.
- `/demo empty`: completed stream with no text.
- `/demo interrupted`: partial text without `done`.
- `/demo slow`: slower stream for testing Stop and scrolling.
- `/demo waiting`: five-second thinking pause; Stop also works while waiting.
- `/demo answer 1` through `/demo answer 100`: preview every prepared reply.

## Key Decisions

- One small hook owns chat state and cancellation. A synchronous request ref prevents double submissions; request identity prevents stale results after clearing/unmounting.
- Native Fetch and `ReadableStream` deliver text as it actually arrives. Retry replaces the failed assistant response and keeps earlier messages intact.
- Received words reveal character by character with a quick 8ms fade per character. Unicode graphemes keep emoji and accented letters intact. Each word reserves its layout space, and its final character releases the next queued word. There is no trailing cursor. Completion and its divider wait for the last animation; Stop discards queued words. Reduced motion advances immediately. Frame-based scroll-follow eases line growth and pauses for manual scrolling.
- CSS custom properties, system fonts, and Lucide keep the UI fast and dependencies modest. No remote fonts, markdown renderer, analytics, or UI framework.
- Auto-scroll follows new text only while near the bottom. Scrolling upward reveals an explicit “Latest response” button.
- AI content is rendered as text. Screen readers hear state transitions instead of every streamed token. The composer supports IME, Enter/Shift+Enter, visible focus, and reduced motion.

## Privacy and security limits

Personal details are accepted without a content-blocking check in the browser or server. Emails, phone numbers, and other details remain in the encrypted message without redaction. Empty inputs, the 4,000-character limit, encryption requirements, and request integrity checks still apply. Encryption protects request contents; it does not anonymize the message or prevent the service from seeing personal information after decrypting it.

Only `/iq` receives encrypted chat messages; `/iq/key` serves public key material. Requests omit cookies and referrers, with no API keys, message logging, or browser metadata in the payload. Messages live in React memory; refreshing closes the conversation. The app makes no AI provider calls. A real service must enforce its own privacy policy, validation, retention, access controls, and HTTPS transport security. Encryption does not protect against malicious browser scripts, a compromised endpoint, or misuse of decrypted data.

The doctor robot waves once with the hand on the viewer's left. The hand uses a chunky LEGO-style C-shaped gripper, wrist connector, and elbow bearing. It then keeps its existing floating and blinking animation. New chat does not replay the wave; reloading starts a new app session. Reduced motion disables the wave and idle animation.

## Tests

Vitest covers empty/duplicate submissions, acceptance of personal details without redaction, encrypted payloads and real cryptographic round-trips, tamper rejection, cancellation, incremental rendering, UTF-8 and record splits, network/API/protocol failures, empty responses, interruption, retry, abort/unmount cleanup, the 100-answer catalog, and keyboard/IME behavior. Browser checks verify matching streamed replies, personal-detail submission, the information dialog, the mechanical wave, and the welcome screen after New chat.
