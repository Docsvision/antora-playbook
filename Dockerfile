FROM node:18.13.0 AS builder

WORKDIR /src

COPY package*.json .
RUN npm ci --no-audit
COPY . .
RUN npx antora antora-playbook.yml

FROM nginx:1.22.1

COPY --from=builder /src/wwwroot/ /usr/share/docsvision/html/
COPY nginx/default.conf /etc/nginx/conf.d/
