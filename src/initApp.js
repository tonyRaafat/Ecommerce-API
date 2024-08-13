import dotenv from 'dotenv';
import { errorHandler } from './utils/errorhandler.js';
import { dbConnection } from '../database/dbConnection.js';
import * as routes from './modules/index.routes.js'
import cors from 'cors'
export const initApp = (app, express) => {

  dotenv.config();
  dbConnection();

  app.use(cors())
  app.use(express.json());

  app.get('/',(req,res,next)=>{
    res.status(200).json({msg:"Server is running..."})
  })

  app.use('/users', routes.usersRoutes);
  app.use('/categories', routes.categoryRoutes);
  app.use('/subCategories', routes.subCategoryRoutes)
  app.use('/brands', routes.brandRoutes)
  app.use('/products', routes.productRoutes)
  app.use('/orders', routes.orderRoutes)
  app.use('/coupons', routes.couponRoutes)
  app.use('/carts', routes.cartRoutes)
  app.use('/orders', routes.orderRoutes)
  app.use('/wishLists', routes.wishListRoutes)
  app.use('/reviews', routes.reviewRoutes)




  app.all('*', (req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.originalUrl}`)
    error.statusCode = 404
    next(error)
  })

  app.use(errorHandler)

}