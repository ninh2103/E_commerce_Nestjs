import { z } from 'zod'

export const PaymentTransactionSchema = z.object({
  id: z.number(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string().nullable(),
  subAccount: z.string().nullable(),
  amountIn: z.number(),
  amountOut: z.number(),
  accumulated: z.number(),
  code: z.string().nullable(),
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  body: z.string().nullable(),
  createdAt: z.date(),
})
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>

export const WebhookPaymentBodySchema = z.object({
  id: z.number(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string().nullable(),
  code: z.string().nullable(),
  content: z.string().nullable(),
  transferType: z.enum(['in', 'out']).nullable(),
  transferAmount: z.number(),
  accumulated: z.number(),
  subAccount: z.string().nullable(),
  referenceCode: z.string().nullable(),
  description: z.string(),
})
export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>
