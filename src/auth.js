import { basicAuth as honoBasicAuth } from 'hono/basic-auth'

// Basic Auth Middleware
export const basicAuth = (c, next) => {
  const auth = honoBasicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
};