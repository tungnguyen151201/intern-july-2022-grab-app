const password = process.env.MONGODB_PASSWORD;

module.exports = {
  mongodb: {
    connnectionString: process.env.DB_CONNECTION_STRING || `mongodb+srv://huytung:${password}@cluster0.szpdftl.mongodb.net/grap?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
