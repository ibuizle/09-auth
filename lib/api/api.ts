import axios from 'axios';

// На проді/прев’ю будемо ходити на той самий origin, де відкритий сайт.
// Це гарантує, що cookies працюють.
const origin =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const baseURL = `${origin}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});