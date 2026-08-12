# LibreOffice conversion worker POC

This is an isolated, standalone Node.js HTTP service proof of concept for DOCX-to-PDF conversion. LibreOffice performs document rendering; this worker validates signed conversion requests, starts isolated LibreOffice processes, returns the resulting PDF, and removes temporary data.

The service intentionally has no database, queue, authentication, cloud storage, or production integration.

## Linux prerequisites

Install a current supported Node.js runtime and LibreOffice Writer on the host. For Debian/Ubuntu hosts, for example:

```bash
sudo apt-get update
sudo apt-get install --no-install-recommends libreoffice-writer libreoffice-core fonts-dejavu-core
command -v soffice
soffice --version
```

The worker resolves LibreOffice in this order:

1. `LIBREOFFICE_PATH`, when set to an absolute executable path or a command available on `PATH`.
2. `soffice` from `PATH` on Linux.
3. `C:\Program Files\LibreOffice\program\soffice.exe` on Windows for local development.

On Windows, if the adjacent `soffice.com` console host exists, it is used to ensure the worker can wait for the actual conversion process.

The service account needs permission to execute LibreOffice and to create/delete directories in the operating system temporary directory (normally `/tmp` on Linux).

## Install, build, and start

From this directory on the host:

```bash
npm install
npm run build
PORT=3030 npm start
```

`npm start` launches the compiled HTTP server on `0.0.0.0:3030` by default. It handles `SIGTERM` and `SIGINT`: it stops accepting new work, allows active conversions a short grace period, then stops only LibreOffice processes that this worker started.

## Configuration

All limits are positive integers. Invalid or missing values use their safe defaults.

| Variable | Default | Purpose |
| --- | ---: | --- |
| `LIBREOFFICE_PATH` | `soffice` on Linux | Explicit LibreOffice executable or a command on `PATH`. |
| `PORT` | `3030` | HTTP listener port. |
| `HOST` | `0.0.0.0` | HTTP bind address. Leave at the default for a cloud host. |
| `MAX_UPLOAD_BYTES` | `26214400` | Maximum DOCX file bytes (25 MiB). |
| `CONVERSION_TIMEOUT_MS` | `120000` | Per-conversion LibreOffice timeout. |
| `MAX_CONCURRENT_CONVERSIONS` | `2` | Maximum concurrent LibreOffice conversion processes. |
| `CONVERSION_TICKET_SECRET` | _required for conversion_ | Shared, random 32+ character secret used to verify short-lived HMAC conversion tickets. Set the same value in the DocSprintHub ticket issuer; never send it to a browser. |
| `ALLOWED_ORIGINS` | _none_ | Comma-separated exact DocSprintHub browser origins permitted by CORS, for example `https://docsprinthub.vercel.app`. Wildcards are not supported. |

The older `LO_WORKER_*` names remain accepted for local POC compatibility, but new deployments should use the variables above.

## Container deployment POC

The included Dockerfile packages only this isolated worker, Node.js 20, and the non-interactive LibreOffice Writer conversion components. It uses Debian's `libreoffice-core` and `libreoffice-writer` packages with `--no-install-recommends`; no LibreOffice desktop application is launched. It also installs Fontconfig plus DejaVu, Liberation, Carlito, Caladea, and Noto Core fonts, then rebuilds the Fontconfig cache during the image build.

Those fonts are intentionally part of layout fidelity, not cosmetic extras: Liberation provides metric-compatible fallbacks for Arial and Times New Roman, while Carlito and Caladea cover common Calibri/Cambria documents. This reduces pagination changes when source Microsoft fonts cannot be redistributed in the image. The service runs as an unprivileged `worker` user and uses `soffice` on `PATH` through `LIBREOFFICE_PATH=soffice`.

Build from the repository root:

```bash
docker build --tag docsprinthub-libreoffice-worker:local tools/libreoffice-worker
```

After building, inspect the effective substitutions if a document's pagination differs from its source environment:

```bash
docker run --rm --entrypoint fc-match docsprinthub-libreoffice-worker:local Arial
docker run --rm --entrypoint fc-match docsprinthub-libreoffice-worker:local "Times New Roman"
```

Both commands should resolve to installed metric-compatible fallbacks rather than an arbitrary DejaVu face.

Run it with explicit resource limits appropriate to the host. The container has no persistent document storage; the existing worker creates and deletes unique job directories and LibreOffice profiles in the container's `/tmp` filesystem.

```bash
docker run --rm --name docsprinthub-libreoffice-worker \
  --publish 3030:3030 \
  --memory 2g \
  --cpus 2 \
  --env PORT=3030 \
  --env LIBREOFFICE_PATH=soffice \
  --env MAX_UPLOAD_BYTES=26214400 \
  --env CONVERSION_TIMEOUT_MS=120000 \
  --env MAX_CONCURRENT_CONVERSIONS=2 \
  --env CONVERSION_TICKET_SECRET="set-a-strong-shared-secret" \
  --env ALLOWED_ORIGINS=https://docsprinthub.vercel.app \
  docsprinthub-libreoffice-worker:local
```

The image exposes TCP port `3030`. It binds to `0.0.0.0` by default and has a Docker health check which makes a local `GET /health` request. Check it manually with:

```bash
curl --fail-with-body http://127.0.0.1:3030/health
```

Convert a DOCX using multipart form data:

```bash
curl --fail-with-body \
  --request POST http://127.0.0.1:3030/convert/docx-to-pdf \
  --form 'file=@/absolute/path/input.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document' \
  --output converted.pdf
```

`PORT`, `LIBREOFFICE_PATH`, `MAX_UPLOAD_BYTES`, `CONVERSION_TIMEOUT_MS`, and `MAX_CONCURRENT_CONVERSIONS` are all configurable with the variables documented above. The container starts the current server using `npm start`. Docker sends `SIGTERM` when stopping the container; the existing server stops new work, allows active work a bounded grace period, then terminates only its own LibreOffice child processes.

## HTTP API

### `GET /health`

Returns JSON suitable for a cloud-platform health check. `200` means LibreOffice is available; `503` means it is not available. Successful responses contain only service state, LibreOffice availability/version, and active-conversion count—never internal filesystem paths.

```bash
curl -fsS http://127.0.0.1:3030/health
```

Example response:

```json
{
  "status": "ok",
  "libreOffice": { "available": true, "version": "LibreOffice 24.2.0.3" },
  "activeConversions": 0,
  "durationMs": 34
}
```

### `POST /convert/docx-to-pdf`

Send a single `.docx` part named `file` plus an `X-Conversion-Ticket` header. The ticket is a five-minute, HMAC-SHA256 capability minted by DocSprintHub's server-side conversion-session endpoint. It is bound to `docx-to-pdf`, the declared filename, and the exact declared input byte count. It is not an API key and must not be created in a browser.

The worker rejects a missing, invalid, expired, mismatched, or previously used ticket with `401`. Replay detection is bounded in memory per worker instance; it provides defense in depth but is not durable across restarts or multiple instances. Durable cross-instance replay prevention would require a shared store and is deliberately outside this POC.

For browser uploads, configure `ALLOWED_ORIGINS` and send the request from one of those origins. The server handles `OPTIONS` and returns explicit CORS headers for only configured origins. CORS is not authentication; ticket verification remains mandatory.

```bash
curl --fail-with-body \
  -X POST http://127.0.0.1:3030/convert/docx-to-pdf \
  -H "X-Conversion-Ticket: <server-issued-ticket>" \
  -F 'file=@/srv/fixtures/sample.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document' \
  --output converted.pdf
```

Useful success headers include conversion duration and input/output byte counts. `413` indicates an oversized upload, `429` means all conversion slots are occupied, `422` indicates a conversion failure, and `503` is returned while the service is shutting down. PDFs are returned with `Cache-Control: no-store, max-age=0`. The worker creates a unique output directory for every job and the converter refuses to overwrite an existing output filename.

## Temporary data and safety boundaries

For every request, the worker creates unique OS-temporary input and output directories. The converter separately creates a unique LibreOffice user profile. The original DOCX is never changed. The generated PDF, upload, profile, and directories are removed after either a successful response or a failure. No job document is stored permanently by this POC.

The upload limit, timeout, ticket verification, replay cache, CORS policy, and concurrency cap prevent several common failure and abuse modes, but this is not a complete internet-facing security perimeter. Before deploying publicly, use TLS, apply request-rate and network controls at the ticket issuer and worker edge, run under a dedicated unprivileged account, monitor resource use, and keep LibreOffice/security updates current. This POC does not execute macros, but untrusted office files still require operational isolation appropriate to the deployment environment.

## CLI remains available

The local command-line POC is unchanged:

```bash
npm run convert -- /absolute/path/input.docx /absolute/path/output-directory
```

It creates the output directory when needed and refuses to overwrite an existing `<input-name>.pdf` file.

## Tests and deployment verification

The normal test suite does not require LibreOffice:

```bash
npx tsc -p tools/libreoffice-worker/tsconfig.json --noEmit
npm test
```

For a host-level verification with LibreOffice installed, supply any DOCX fixture path. The test starts the service on an ephemeral local port, checks `/health`, uploads the fixture, verifies the PDF signature, and checks that request/profile temporary directories were removed:

```bash
LO_WORKER_DEPLOYMENT_FIXTURE=/srv/fixtures/sample.docx npm run verify:deployment
```

The broader HTTP integration/concurrency test is optional and uses `LO_WORKER_PBSB_FIXTURE` plus `LO_WORKER_BIODATA_FIXTURE`. Neither fixture is required in CI.
