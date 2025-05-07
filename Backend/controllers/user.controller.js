const registerUser =  (req,res) =>{
  const {name, email, password} = req.body;
  console.log(name,email,password);
 }

 export {registerUser};