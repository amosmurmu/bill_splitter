import { Hono } from 'hono'

const payments = new Hono<{ Bindings: Env }>()

payments.post('/bills/:billId/shares/:shareId/pay', async (c) => {
  const idempotencyKey = c.req.header('Idempotency-Key')

  if (!idempotencyKey) {
    return c.json({ error: 'Idempotency-Key is required' }, 400)
  }

  const { billId, shareId } = c.req.param()

  const share = await c.env.DB.prepare(
    `
    SELECT id, bill_id, member_id, amount_cents, paid_at, idempotency_key
    FROM bill_shares
    WHERE id = ? AND bill_id = ?
    `
  )
    .bind(shareId, billId)
    .first<{
      id: string
      bill_id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      idempotency_key: string | null
    }>()

  if (!share) {
    return c.json({ error: 'Bill or share not found' }, 404)
  }

  if (share.paid_at !== null) {
    if (share.idempotency_key !== idempotencyKey) {
      return c.json({ error: 'Share already paid' }, 409)
    }

    return c.json({
      id: share.id,
      memberId: share.member_id,
      amountCents: share.amount_cents,
      paidAt: share.paid_at,
    })
  }
  const paidAt = new Date().toISOString()

  const result = await c.env.DB.prepare(
    `
    UPDATE bill_shares
    SET paid_at = ? , idempotency_key = ?
    WHERE id = ? AND bill_id = ? AND paid_at IS NULL 
    `
  )
    .bind(paidAt, idempotencyKey, shareId, billId)
    .run()

  if (result.meta.changes === 0) {
    const updatedShare = await c.env.DB.prepare(
      `SELECT id, member_id, amount_cents, paid_at, idempotency_key
       FROM bill_shares
       WHERE id = ? AND bill_id = ?`
    )
      .bind(shareId, billId)
      .first<{
        id: string
        member_id: string
        amount_cents: number
        paid_at: string | null
        idempotency_key: string | null
      }>()

    if (!updatedShare || updatedShare.idempotency_key !== idempotencyKey) {
      return c.json({ error: 'Share already paid' }, 409)
    }

    return c.json({
      id: updatedShare.id,
      memberId: updatedShare.member_id,
      amountCents: updatedShare.amount_cents,
      paidAt: updatedShare.paid_at,
    })
  }

  return c.json({
    id: share.id,
    memberId: share.member_id,
    amountCents: share.amount_cents,
    paidAt,
  })
})

export default payments
