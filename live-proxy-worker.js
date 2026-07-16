// TOKYO HEROES — CSV CORS proxy Worker
// ?type=live → ライブ情報スプレッドシート
// ?type=news → NEWSスプレッドシート
// Cloudflare ダッシュボードでこのコードを貼り付けてデプロイしてください

const CSV_URLS = {
  live: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxrKLhzW0ALm9nJA_znqnVwBegiAdOwWMOv8GuCR0ySqe4eOvfwX6hUJld3a-X7wu6asdarHHMbi3v/pub?gid=0&single=true&output=csv',
  news: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUiYc82UODMVsXTJvsGGPT4d7vrVxDAUdUb8nfqRlKbUgejy4fC0HJO9bzsDwK5W-RwAf4miVGXM1G/pub?gid=0&single=true&output=csv',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'live';
    const csvUrl = CSV_URLS[type];

    if (!csvUrl) {
      return new Response('Unknown type', {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const res = await fetch(csvUrl, { redirect: 'follow' });
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
