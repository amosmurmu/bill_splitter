import { Hono } from 'hono'
import homes from './routes/home.routes'
import bills from './routes/bill.routes'
import payments from './routes/payment.routes'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api', homes)
app.route('/api', bills)
app.route('/api', payments)

export default app
