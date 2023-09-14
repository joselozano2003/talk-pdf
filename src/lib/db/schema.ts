import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'


export const roleEnum = pgEnum('roleEnum', ['system', 'user'])

export const chats = pgTable('chats',{
    id: serial('id').primaryKey(),
    pdfName: text('pdfName').notNull(),
    pdfUrl: text('pdfUrl').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('userId', {length:255}).notNull(),
    fileKey: text('fileKey').notNull(),
})


export const messages = pgTable('messages',{
    id: serial('id').primaryKey(),
    chatId: integer('chatId').references(()=>chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    role: roleEnum('role').notNull()
})

export type DrizzleChat = typeof chats.$inferInsert;


export const userSubscriptions = pgTable('userSubscriptions',{
    id: serial('id').primaryKey(),
    userId: varchar('userId', {length:256}).notNull().unique(),
    stripeCustomerId: varchar('stripeCustomerId', {length:256}).notNull().unique(),
    stripeSubscriptionId: varchar('stripeSubscriptionId', {length:256}).unique(),
    stripePriceId: varchar('stripePriceId', {length:256}),
    stripeCurrentPeriodEnd: timestamp('stripeCurrentPeriodEnd'),
})
