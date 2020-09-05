const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "navdeepsingh.26.2000@gmail.com",
      pass: "",
    },
  },
  google_client_id:
    "658321949336-ag6vqmf8ss399bdk6rjoua4rbpif9gjo.apps.googleusercontent.com",
  google_client_secret: "BVkKy73Xh5fl2-HhDaOLevjc",
  google_callback_url: "http://localhost:3000/users/auth/google/callback",
  jwt_secret: "codeial",
};

const production = {
  name: "production",
  asset_path: "/assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "navdeepsingh.26.2000@gmail.com",
      pass: "",
    },
  },
  google_client_id:
    "658321949336-ag6vqmf8ss399bdk6rjoua4rbpif9gjo.apps.googleusercontent.com",
  google_client_secret: "BVkKy73Xh5fl2-HhDaOLevjc",
  google_callback_url: "http://localhost:3000/users/auth/google/callback",
  jwt_secret: "codeial",
};

module.exports =
  eval(process.env.CODEIAL_ENVIRONMENT) === undefined
    ? development
    : eval(process.env.CODEIAL_ENVIRONMENT);
