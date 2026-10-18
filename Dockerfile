# The image Railway builds from this repo: the site built with bun, then
# run by bun, whose S3 client its routes use. Railway sets PORT and puts its proxy in front, which
# says the request's protocol in X-Forwarded-Proto.
FROM docker.io/oven/bun:1.3.14 AS build
WORKDIR /site
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun --bun vite build --logLevel warn

FROM docker.io/oven/bun:1.3.14
WORKDIR /site
ENV NODE_ENV=production PROTOCOL_HEADER=x-forwarded-proto
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /site/build build
COPY server.js ./
USER bun
CMD ["bun", "server.js"]
