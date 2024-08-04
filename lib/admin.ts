import { auth } from "@clerk/nextjs/server"

const adminIds = [
  "user_2juGrPeGIFvE7dYcFeEfY7IMubB"
]

export const isAdmin = () => {
  const { userId } = auth()

  if(!userId) return false

  return adminIds.includes(userId)
}