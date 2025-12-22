import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateVisitNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const prefix = `RM${year}${month}`;
  
  const lastVisit = await prisma.visit.findFirst({
    where: {
      visitNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      visitNumber: 'desc'
    }
  });

  let sequence = 1;
  
  if (lastVisit && lastVisit.visitNumber) {
    const lastSequence = parseInt(lastVisit.visitNumber.slice(-4));
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  const sequenceStr = String(sequence).padStart(4, '0');
  return `${prefix}${sequenceStr}`;
}