// TODO load all schema from the *.graphql files
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

const typeDefs = loadSchemaSync('./**/*.graphql', { loaders: [new GraphQLFileLoader()] });

module.exports = typeDefs;
