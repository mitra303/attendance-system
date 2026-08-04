import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function updateMonthlyLeaves() {

  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const monthKey = `${currentYear}-${currentMonth}`

  console.log("Running monthly leave script for:", monthKey)

  const interns = await prisma.user.findMany({
    where: {
      role: 3,
      status: "active",
      doj: { not: null }
    },
    select: {
      id: true,
      doj: true
    }
  })

  for (const intern of interns) {

    const doj = new Date(intern.doj!)

    const joinMonth = doj.getMonth() + 1
    const joinYear = doj.getFullYear()

    const isJoinMonth =
      currentMonth === joinMonth &&
      currentYear === joinYear

    const existing = await prisma.leaveBalance.findUnique({
      where: { userId: intern.id }
    })

    // Prevent duplicate monthly update
    if (existing?.lastUpdatedMonth === monthKey) {
      console.log(`User ${intern.id} already updated`)
      continue
    }

    let casual = existing?.casual ?? 0
    let earned = existing?.earned ?? 0

    // Casual leave increment
    casual += 1

    // Earned leave increment (skip join month)
    if (!isJoinMonth) {
      earned += 1
    }

    // Short leave reset monthly
    const short = 2

    await prisma.leaveBalance.upsert({
      where: {
        userId: intern.id
      },
      update: {
        casual,
        earned,
        short,
        lastUpdatedMonth: monthKey
      },
      create: {
        userId: intern.id,
        casual: 1,
        earned: isJoinMonth ? 0 : 1,
        short: 2,
        lastUpdatedMonth: monthKey
      }
    })

    console.log(`Updated leaves for user ${intern.id}`)

  }

  console.log("Monthly leave update completed")

}

updateMonthlyLeaves()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })