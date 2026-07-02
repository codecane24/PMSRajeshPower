import prisma from '../../lib/prisma'

export async function ensureSerialNumbers() {
  const SERIAL_CONFIGS = [
    {
      name: 'support_ticket',
      prefix: 'SPTK',
      length: 4,
      year: new Date().getFullYear(),
      nextNumber: 1,
      type: 'transaction',
    },
    {
      name: 'user_code',
      prefix: 'USR',
      length: 5,
      year: new Date().getFullYear(),
      nextNumber: 1,
      type: 'master',
    },
    {
      name: 'dispatch_code',
      prefix: 'DSP',
      length: 4,
      year: new Date().getFullYear(),
      nextNumber: 1,
      type: 'transaction',
    },
  ]

  for (const config of SERIAL_CONFIGS) {
    const exists = await prisma.serialNumber.findUnique({
      where: { name: config.name },
    })
    if (!exists) {
      await prisma.serialNumber.create({ data: config })
    }
  }
}
