const jwt = require("jsonwebtoken");


const verifyToken = async (req,res,next)=>{
  const authHeader = req.headers.authorization
if (!authHeader || !authHeader.startsWith('Bearer')) {
return res.status(400).json({msg:'invalid token provided'})
}
  const token = authHeader.split(' ')[1]
  if(!token){
      return res.status(400).send('please provide token for authentication')
  }
  try{
      const payload = jwt.verify(token, process.env.TOKEN_KEY)
      // attach the user to the subscriber routes
      req.user = { user_id:payload.user_id, service_id:payload.service_id,role:payload.role};
   next()
  } catch {
      return res.status(500).send('server error occured')
  }
}



module.exports = verifyToken;
