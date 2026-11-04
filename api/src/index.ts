import { Hono } from 'hono'
import balances from './routes/balance.routes'
import bills from './routes/bill.routes'
import homes from './routes/home.routes'
import payments from './routes/payment.routes'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api', homes)
app.route('/api', bills)
app.route('/api', payments)
app.route('/api', balances)

export default app
