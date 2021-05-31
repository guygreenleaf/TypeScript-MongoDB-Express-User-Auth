# Starting scripts:
yarn init 

yarn add express mongoose dotenv cors morgan cookie-parser

# dev dependencies
yarn add @types/express @types/mongoose @types/dotenv @types/cors @types/morgan @types/cookie-parser --dev

# create tsconfig
yarn tsc --init

# create dist
yarn tsc

# run dist
node dist/index.js


