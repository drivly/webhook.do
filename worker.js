const api = {
  icon: '⚡️☁️',
  name: 'webhooks.do',
  description: 'Webhook Storage',
  url: 'https://webhooks.do/api',
  type: 'https://apis.do/tools',
  endpoints: {
    webhook: 'https://webhooks.do/:namespace',
    details: 'https://webhooks.do/:namespace/:id',
  },
  site: 'https://webhooks.do',
  repo: 'https://github.com/drivly/webhooks.do',
}

export default {
  fetch: async (req, env) => {
    const { user } = await env.CTX.fetch(req).then(res => res.json())
    const { origin, hostname, pathname } = new URL(req.url)
    const [ _, namespace, id ] = pathname.split('/')
    const body = await req.json().catch(ex => undefined)
    return new Response(JSON.stringify({ api, body, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}
