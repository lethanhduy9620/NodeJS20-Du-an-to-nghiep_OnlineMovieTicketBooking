const config = {
  development: {
    username: "root",
    password: "123456",
    database: "movie_ticket_booking",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  AUTH: {
    SECRET_KEY: "capstone_project_NodeJs_20",
  },
  SYSTEM: {
    PORT: 3001,
    HOST: "",
    DOMAIN: "http://localhost",
  },
};

module.exports = config;
