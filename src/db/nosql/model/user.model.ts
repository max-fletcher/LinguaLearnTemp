import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
});

const AppUserModel = mongoose.model('User', userSchema);

export default AppUserModel;
