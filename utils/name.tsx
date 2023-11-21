export function isProduction() {
  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://deadendbooks.org/"
    : "http://localhost:3000/";

  return url;
}
