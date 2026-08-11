# syntax=docker/dockerfile:1

# Compile the standalone worker without bringing build tooling into the final
# image. The POC has no runtime npm dependencies after TypeScript compilation.
FROM node:20-bookworm-slim AS build

WORKDIR /opt/libreoffice-worker

COPY package.json ./
RUN npm install --ignore-scripts --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Keep the runtime image small and non-interactive. libreoffice-writer pulls
# only the Writer conversion components required for DOCX-to-PDF; the desktop
# launchers and optional office applications are not installed explicitly.
FROM node:20-bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
      ca-certificates \
      fonts-dejavu-core \
      libreoffice-core \
      libreoffice-writer \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/libreoffice-worker

COPY --from=build /opt/libreoffice-worker/package.json ./
COPY --from=build /opt/libreoffice-worker/dist ./dist

# Do not run converters as root. Each request still receives its own
# temporary input/output directories and LibreOffice profile under /tmp.
RUN useradd --system --create-home --home-dir /home/worker worker

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3030 \
    LIBREOFFICE_PATH=soffice \
    MAX_UPLOAD_BYTES=26214400 \
    CONVERSION_TIMEOUT_MS=120000 \
    MAX_CONCURRENT_CONVERSIONS=2 \
    TMPDIR=/tmp

USER worker

EXPOSE 3030

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const http=require('node:http');const request=http.get('http://127.0.0.1:'+(process.env.PORT||3030)+'/health',(response)=>process.exit(response.statusCode===200?0:1));request.on('error',()=>process.exit(1));request.setTimeout(4000,()=>{request.destroy();process.exit(1)});"

# npm is the container entrypoint so the existing service startup command is
# used unchanged. The server handles SIGTERM/SIGINT and terminates only its own
# LibreOffice child processes after its grace period.
CMD ["npm", "start"]
