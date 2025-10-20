import { Router } from 'express'
import nutritionRoutes from './nutrition.js'
import mailerRoutes from './mailer.js'

const router = Router()

router.use(nutritionRoutes)
router.use(mailerRoutes)

export default router
