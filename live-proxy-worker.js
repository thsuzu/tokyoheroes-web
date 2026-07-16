// TOKYO HEROES — Live data CORS proxy Worker
// Cloudflare ダッシュボードでこのコードを貼り付けてデプロイしてください

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxrKLhzW0ALm9nJA_znqnVwBegiAdOwWMOv8GuCR0ySqe4eOvfwX6hUJld3a-X7wu6asdarHHMbi3v/pub?gid=0&single=true&output=csv';

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    try {
      const res = await fetch(CSV_URL, { redirect: 'follow' });
      if (!res.ok) {
        return new Response(`Upstream error: ${res.status}`, {
          status: res.status,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      }
      const text = await res.text();
      return new Response(text, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    } catch (e) {
      return new Response(`Error: ${e.message}`, {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
