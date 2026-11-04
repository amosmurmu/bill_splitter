import { Hono } from 'hono'
import { createBillSchema } from '../validators/bills.validators'

const bills = new Hono<{ Bindings: Env }>()

bills.post('/homes/:homeId/bills', async (c) => {
  const body = await c.req.json()

  const parsed = createBillSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid bill details' }, 422)
  }

  const { title, totalCents } = parsed.data

  const homeId = c.req.param('homeId')

  const homeQuery = `SELECT id FROM homes WHERE id = ?`

  const home = await c.env.DB.prepare(homeQuery).bind(homeId).first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const members = await c.env.DB.prepare(
    `SELECT id, name, position
FROM members
WHERE home_id = ?
ORDER BY position ASC;`,
  )
    .bind(homeId)
    .all()

  if (members.results.length === 0) {
    return c.json({ error: 'Home has no members' }, 422)
  }

  const base = Math.floor(totalCents / members.results.length)
  const remainder = totalCents % members.results.length

  const shares = members.results.map((member, index) => ({
    id: crypto.randomUUID(),
    memberId: member.id,
    amountCents: base + (index < remainder ? 1 : 0),
    paidAt: null,
  }))

  const billId = crypto.randomUUID()

  const billStatement = c.env.DB.prepare(
    `INSERT INTO bills (id,home_id,title,total_cents) 
    VALUES (?, ?, ?,?)
    `,
  ).bind(billId, homeId, title, totalCents)

  const shareStatements = shares.map((share) =>
    c.env.DB.prepare(
      `
      INSERT INTO bill_shares
      (id,bill_id, member_id,amount_cents,paid_at)
      VALUES(?,?,?,?,?)
    `,
    ).bind(share.id, billId, share.memberId, share.amountCents, share.paidAt),
  )

  await c.env.DB.batch([billStatement, ...shareStatements])
  return c.json(
    {
      id: billId,
      homeId,
      title,
      totalCents,
      shares,
    },
    201,
  )
})

export default bills
