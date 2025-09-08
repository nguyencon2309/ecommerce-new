import mongoose, { Schema, Document} from "mongoose";

export interface IGener extends Document {

  catelogy:String

}

const generSchema = new Schema<IGener>(
  {
    catelogy:{type:String,required:true},
    
    
  },
  { timestamps: true }
);

export default mongoose.model<IGener>("Gener", generSchema);
