export const config = { runtime: 'edge' };

// Provider endpoint and request builder config
const PROVIDER_CONFIG = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
    body: (model, system, message) => JSON.stringify({
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      stream: true,
      system,
      messages: [{ role: 'user', content: message }],
    }),
  },
  kimi: {
    url: 'https://api.moonshot.cn/v1/chat/completions',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    body: (model, system, message) => JSON.stringify({
      model: model || 'moonshot-v1-32k',
      max_tokens: 2000,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    }),
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    body: (model, system, message) => JSON.stringify({
      model: model || 'gpt-4o',
      max_tokens: 2000,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    }),
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    }),
    body: (model, system, message) => JSON.stringify({
      model: model || 'deepseek-chat',
      max_tokens: 2000,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    }),
  },
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { apiKey, provider = 'anthropic', model, message, system } = body;

  if (!apiKey || !message) {
    return new Response(JSON.stringify({ error: '缺少 apiKey 或 message 参数' }), { status: 400, headers: CORS });
  }

  const cfg = PROVIDER_CONFIG[provider];
  if (!cfg) {
    return new Response(JSON.stringify({ error: `不支持的服务商: ${provider}` }), { status: 400, headers: CORS });
  }

  const defaultSystem = '你是一位专门辅导初中生的化学老师，风格生动有趣，善用生活例子，用中文回答。';
  const upstream = await fetch(cfg.url, {
    method: 'POST',
    headers: cfg.headers(apiKey),
    body: cfg.body(model, system || defaultSystem, message),
  });

  if (!upstream.ok) {
    let errMsg = '上游 API 请求失败';
    try {
      const e = await upstream.json();
      errMsg = e.error?.message || e.error || errMsg;
    } catch {}
    return new Response(JSON.stringify({ error: errMsg }), { status: upstream.status, headers: CORS });
  }

  const { readable, writable } = new TransformStream();
  upstream.body.pipeTo(writable);

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', ...CORS },
  });
}
