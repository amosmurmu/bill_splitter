import { Hono } from 'hono'

const balances = new Hono<{ Bindings: Env }>()

balances.get('/homes/:homeId/balances', async (c) => {
  const homeId = c.req.param('homeId')

  const home = await c.env.DB.prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const balanceQuery = ` SELECT
    m.id   AS member_id,
    m.name,
    COALESCE(SUM(bs.amount_cents), 0) AS outstanding_cents
  FROM members m
  LEFT JOIN bill_shares bs
    ON bs.member_id = m.id
   AND bs.paid_at IS NULL
  WHERE m.home_id = ?
  GROUP BY m.id, m.name, m.position
  ORDER BY m.position ASC
  `

  const result = await c.env.DB.prepare(balanceQuery).bind(homeId).all<{
    member_id: string
    name: string
    outstanding_cents: number
  }>()

  const memberBalances = result.results.map((row) => ({
    memberId: row.member_id,
    name: row.name,
    outstandingCents: row.outstanding_cents,
  }))

  return c.json({ balances: memberBalances })
})

export default balances
