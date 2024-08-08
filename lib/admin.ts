import { auth } from "@clerk/nextjs/server"

const adminIds = [
  "user_2juGrPeGIFvE7dYcFeEfY7IMubB",
  "user_2k8OAvRjMwR9tsZZZL3XRLIurPl"
]

export const isAdmin = () => {
  const { userId } = auth()

  if(!userId) return false

  return adminIds.includes(userId)
}