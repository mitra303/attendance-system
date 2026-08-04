import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req:Request){

  const {token,password} = await req.json()

  const user = await prisma.user.findFirst({
    where:{resetToken:token}
  })

  if(!user){
    return Response.json({
      message:"Invalid token"
    },{status:400})
  }

  const hashedPassword = await bcrypt.hash(password,10)

  await prisma.user.update({
    where:{id:user.id},
    data:{
      password:hashedPassword,
      resetToken:null
    }
  })

  return Response.json({
    message:"Password reset successful"
  })
}