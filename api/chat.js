export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { apiKey, message, system } = body;

  if (!apiKey || !message) {
    return new Response(JSON.stringify({ error: '缺少 apiKey 或 message 参数' }), { status: 400 });
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      stream: true,
      system: system || '你是一位专门辅导初中生的化学老师，风格生动有趣。用中文回答。',
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.json();
    return new Response(
      JSON.stringify({ error: err.error?.message || 'Anthropic API 请求失败' }),
      { status: anthropicRes.status }
    );
  }

  const { readable, writable } = new TransformStream();
  anthropicRes.body.pipeTo(writable);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
