import { Hono } from 'hono'
import { createHomeSchema } from '../validators/home.validators'
import { createMemberSchema } from '../validators/members.validators'

const homes = new Hono<{ Bindings: Env }>()

homes.get('/homes', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT id, name FROM homes ORDER BY rowid DESC').all()

  return c.json(results)
})

homes.post('/homes', async (c) => {
  const body = await c.req.json()

  const parsed = createHomeSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid home name' }, 400)
  }

  const { name } = parsed.data

  const id = crypto.randomUUID()

  await c.env.DB.prepare('INSERT INTO homes (id, name) VALUES (?, ?)').bind(id, name).run()

  return c.json({ id, name }, 201)
})

homes.get('/homes/:homeId/members', async (c) => {
  const homeId = c.req.param('homeId')

  const { results } = await c.env.DB.prepare(
    `SELECT id, home_id AS homeId, name, position
     FROM members
     WHERE home_id = ?
     ORDER BY position ASC`,
  )
    .bind(homeId)
    .all()

  return c.json(results)
})

homes.post('/homes/:homeId/members', async (c) => {
  const body = await c.req.json()
  const parsed = createMemberSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid member name' }, 400)
  }

  const { name } = parsed.data
  console.log('debug adding member', name)
  const id = crypto.randomUUID()
  const homeId = c.req.param('homeId')

  const result = await c.env.DB.prepare(
    `INSERT INTO members (id, home_id, name, position)
     SELECT ?,?,?, 
      COALESCE(
      (SELECT MAX(position) + 1
       FROM members
       WHERE home_id = ?),
      0
    )
     FROM homes
     WHERE id = ?;
    `,
  )
    .bind(id, homeId, name, homeId, homeId)
    .run()

  if (result.meta.changes === 0) {
    return c.json({ error: 'Home not found' }, 404)
  }
  return c.json({ id, homeId, name }, 201)
})

export default homes
