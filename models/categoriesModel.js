import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
  {
      name:{
        type: String,
        required:true,
        trim: true
      },
      address: String,
      mobile: String,
      cart: Array,
      total: Number,
      paymentId: String,
      method: String,
      delivered:{
        type: Boolean,
        default: false
      },
      paid:{
        type: Boolean,
        default: false
      },
      dateOfPayment: Date
  },{
    timestamps: true
  })



  let Dataset = mongoose.models.categories || mongoose.model('categories', categoriesSchema)

  export default Dataset