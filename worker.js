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
    const { user } = await env.CTX.fetch(req)
    const { origin, hostname, pathname } = new URL(req.url)
    const [ _, namespace, id ] = pathname.split('/')
    const body = req.body ? await req.json() : undefined
    return new Response(JSON.stringify({ api, user }, null, 2), {})
  }
}
