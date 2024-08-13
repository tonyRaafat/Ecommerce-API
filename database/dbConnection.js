import mongoose from "mongoose";

export const dbConnection  =async ()=> await mongoose.connect(process.env.MONGODB_URI_ONLINE)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));
