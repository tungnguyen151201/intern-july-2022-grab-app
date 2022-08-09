module.exports = {
  mongodb: {
    connnectionString: process.env.DB_CONNECTION_STRING || `mongodb+srv://huytung:${process.env.MONGODB_PASSWORD}@cluster0.szpdftl.mongodb.net/grap?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
