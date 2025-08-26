// src/app/init.js
const initializeApp = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev only
  } else {
    console.log = () => {};
  }
};
export default initializeApp;
