FROM buildkite/puppeteer:5.2.1

COPY . .

RUN npm install

CMD ["node", "."]