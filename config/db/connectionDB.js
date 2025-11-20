import mongoose from "mongoose";


export const connectionDB=async()=>{
    return mongoose.connect(process.env.MONGODB_URI)
    .then((res)=>console.log('DB Connected Successfully')
    )
    .catch((error)=>console.log('Faild To Connect',error)
    )
}
