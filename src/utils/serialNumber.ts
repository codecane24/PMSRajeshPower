import prisma from '../../lib/prisma'

// Default configs used when a serial number record doesn't exist yet
const SERIAL_DEFAULTS: Record<string, { prefix: string; length: number; type: string }> = {
  support_ticket: { prefix: 'SPTK', length: 4, type: 'transaction' },
  user_code:      { prefix: 'USR',  length: 5, type: 'master' },
  dispatch_code:  { prefix: 'DSP',  length: 4, type: 'transaction' },
}

async function getOrCreateSerial(name: string) {
  let serial = await prisma.serialNumber.findUnique({ where: { name } })
  if (!serial) {
    const defaults = SERIAL_DEFAULTS[name]
    if (!defaults) throw new Error(`Serial number configuration not found: ${name}`)
    serial = await prisma.serialNumber.create({
      data: { name, ...defaults, year: new Date().getFullYear(), nextNumber: 1 },
    })
  }
  return serial
}

export async function previewNextSerialNumber(serialNumberName: string): Promise<string> {
  const serial = await getOrCreateSerial(serialNumberName)
  const currentYear = new Date().getFullYear()
  const nextNum = serial.year !== currentYear ? 1 : serial.nextNumber
  const paddedNum = String(nextNum).padStart(serial.length, '0')
  return `${serial.prefix}${currentYear}${paddedNum}`
}

export async function getNextSerialNumber(serialNumberName: string): Promise<string> {
  const serial = await getOrCreateSerial(serialNumberName)

  const currentYear = new Date().getFullYear()
  let nextNum = serial.nextNumber

  // If year changed, reset nextNumber
  if (serial.year !== currentYear) {
    await prisma.serialNumber.update({
      where: { name: serialNumberName },
      data: { year: currentYear, nextNumber: 1 },
    })
    nextNum = 1
  }

  // Generate the code
  const paddedNum = String(nextNum).padStart(serial.length, '0')
  const code = `${serial.prefix}${currentYear}${paddedNum}`

  // Increment for next time
  await prisma.serialNumber.update({
    where: { name: serialNumberName },
    data: { nextNumber: nextNum + 1 },
  })

  return code
}
