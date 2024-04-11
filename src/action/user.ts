'use server'

import prisma from '@/lib/prisma'

export const getUserByAccount = async (account: string) => {
  return prisma.user.findUnique({
    where: {
      account
    }
  })
}
