import dotenv from 'dotenv';
import { errorHandler } from './utils/errorhandler.js';
import { dbConnection } from '../database/dbConnection.js';
import * as routes from './modules/index.routes.js'

export const initApp = (app,express)=>{ 

dotenv.config();
dbConnection();

app.use(express.json());

app.use('/users', routes.usersRoutes);
app.use('/categories', routes.categoryRoutes);
app.use('/subCategories',routes.subCategoryRoutes)
app.use('brands',routes.brandRoutes)

app.all('*', (req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
})

app.use(errorHandler)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
}