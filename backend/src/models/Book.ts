import mongoose, { Schema, Document ,Types} from "mongoose";

export interface IBook extends Document {

  title: string;
  sold:number;
  price: number;
  description: string;
  image: string;
  stock: number;
  authorId: Types.ObjectId;
  generId:Types.ObjectId;

}

const bookSchema = new Schema<IBook>(
  {
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String},
    image:{type:String},
    sold:{type:Number,required:true,default:0},
    stock:{type:Number,required:true,default:0},
    generId:{type:Schema.Types.ObjectId,ref:"Gener",required:true},
    authorId:{type:Schema.Types.ObjectId,ref:"Author",required:true}
    
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", bookSchema);
