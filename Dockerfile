FROM oven/bun:latest
WORKDIR /usr/src/solide

COPY . /usr/src/solide
RUN bun install

EXPOSE 3000/tcp
CMD ["sh", "start.sh"]