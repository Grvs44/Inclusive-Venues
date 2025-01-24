module.exports = {
  port: 80,
  spa: "inclusivevenues/index.html",
  rewrite: [
    {
      from: "/inclusivevenues/api/(.*)",
      to: "http://localhost:8000/inclusivevenues/api/$1",
    },
  ],
  directory: "react/build/",
  qr: "hostname",
};
