FROM node:lts AS builder

WORKDIR /antora

RUN git clone https://github.com/Docsvision/antora-ui-default.git ui \
    && cd ui \
    && npm ci --no-audit \
    && npx gulp bundle

RUN git clone https://github.com/Docsvision/antora-playbook.git playbook \
    && ln -s ../ui/build playbook/build \
    && cd playbook \
    && npm ci --no-audit \
    && npx antora --redirect-facility nginx antora-playbook.yml

FROM nginx:stable-alpine

COPY --from=builder /antora/playbook/wwwroot/ /usr/share/docsvision/html/
COPY --chmod=644 nginx/default.conf /etc/nginx/conf.d/
