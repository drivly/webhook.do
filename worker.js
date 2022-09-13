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
  login: 'https://webhooks.do/login',
  signup: 'https://webhooks.do/signup',
  repo: 'https://github.com/drivly/webhooks.do',
}

export default {
  fetch: async (req, env) => {
    const { user, body, url, ts, time, headers, cf } = await env.CTX.fetch(req).then(res => res.json())
    const { origin, hostname, pathname } = new URL(req.url)
    let [ _, namespace, id = headers['cf-ray'] ] = pathname.split('/')
    if (namespace.length != 36 || namespace == ':namespace') {
      namespace = crypto.randomUUID() 
    }
    const ua = headers['user-agent']
    const { ip, isp, city, region, country, continent } = user
    const location = `${city}, ${region}, ${country}, ${continent}`
    const list = `https://webhooks.do/${namespace}`
    const data = body ? await env.WEBHOOKS.put(`${namespace}/${id}`, JSON.stringify({ namespace, id, time, url, body, headers, cf, user }, null, 2) , { 
      metadata: { time, ip, ua, location, url: `https://webhooks.do/${namespace}/${id}` },
      expirationTtl: 30 * 24 * 60 * 60 ,
    }) : id != headers['cf-ray'] ? await env.WEBHOOKS.getWithMetadata(`${namespace}/${id}`, { type: "json" }) : await env.WEBHOOKS.list({ prefix: `${namespace}/`}).then(list => list.keys.map(item => item.metadata))
    return new Response(JSON.stringify({ api, namespace, ts, time, id, list, data, user }, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
  }
}
