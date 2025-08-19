const protocol = window.location.protocol;
const wsProtocol = protocol === "https:" ? "wss:" : "ws:";

export const BACKEND_DOMAIN = process.env.REACT_APP_BACKEND_DOMAIN;

export const BACKEND = `${protocol}//${BACKEND_DOMAIN}`;
export const WS_BACKEND = `${wsProtocol}//${BACKEND_DOMAIN}`;

export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;