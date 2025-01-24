module.exports = {
  port: 80,
  spa: "index.html",
  rewrite: [
    {
      from: "/api/(.*)",
      to: "http://localhost:8000/api/$1",
    },
  ],
  directory: "react/build/",
  qr: "hostname",
};
