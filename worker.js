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
    const { user, body, url, headers, cf } = await env.CTX.fetch(req).then(res => res.json())
    const { origin, hostname, pathname } = new URL(req.url)
    const [ _, namespace, id ] = pathname.split('/')
    const ua = headers['user-agent']
    const { ip, isp, city, region, country, continent } = user
    const location = `${city}, {region}, {country}, {continent}`
    const data = body ? await env.WEBHOOKS.put(`${namespace}/${id}`, JSON.stringify({ namespace, id, url, body, headers, cf, user }, null, 2) , { 
      metadata: { ip, ua, location, url: `https://webhooks.do/${namespace}/${id}` },
      expirationTtl: 30 * 24 * 60 * 60 ,
    }) : id ? await env.WEBHOOKS.get(`${namespace}/${id}`, { type: "text" }) : await env.WEBHOOKS.list({ prefix: `${namespace}/`})
    return new Response(JSON.stringify({ api, namespace, id, data, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}
