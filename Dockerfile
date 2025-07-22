FROM node:24

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY packages/lib ./packages/lib/
COPY packages/contracts ./packages/contracts/
COPY packages/avs-operator ./packages/avs-operator/

RUN npm install --workspaces
RUN npm run build:avs

CMD ["npm", "run", "prove"]
