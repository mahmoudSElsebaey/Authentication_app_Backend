import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // ["Bearer",  "token"]


  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY,(err,decoded)=>{
    if(err){
      return res.status(403).json({message:"Forbidden"})
    }
    req.user = decoded.userInfo.id; 
    next();
  });
};
