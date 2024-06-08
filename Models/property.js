import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name:{
      type:String
    },
    category: {
      type: String,
    },
    

    place: {
      type: String,
    },
    price: {
      type: String,
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    size: {
      type: Number,
    },
    description: {
      type: String,
    },
    type:{
      type:String
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
