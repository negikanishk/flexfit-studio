import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Memberships Table
export const memberships = sqliteTable("memberships", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  monthlyPrice: real("monthly_price").notNull(),
  creditsPerMonth: integer("credits_per_month").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// 2. Companies / Corporate Credit Pools Table
export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  creditPoolTotal: integer("credit_pool_total").notNull(),
  creditPoolRemaining: integer("credit_pool_remaining").notNull(),
  contactEmail: text("contact_email").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// 3. Members Table
export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role", { enum: ["admin", "front_desk", "trainer", "member"] }).default("member").notNull(),
  membershipId: text("membership_id").references(() => memberships.id),
  personalCredits: integer("personal_credits").default(0).notNull(),
  companyId: text("company_id").references(() => companies.id),
  status: text("status", { enum: ["active", "inactive", "suspended"] }).default("active").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// 4. Trainers Table
export const trainers = sqliteTable("trainers", {
  id: text("id").primaryKey(),
  memberId: text("member_id").references(() => members.id).notNull(),
  specialties: text("specialties").notNull(), // JSON string array or comma separated
  bio: text("bio"),
  hourlyRate: real("hourly_rate").default(45.0).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// 5. Classes Table
export const classes = sqliteTable("classes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  trainerId: text("trainer_id").references(() => trainers.id).notNull(),
  category: text("category", { enum: ["HIIT", "Yoga", "Pilates", "Strength", "Cycling", "Boxing"] }).notNull(),
  capacity: integer("capacity").notNull(),
  creditCost: integer("credit_cost").default(1).notNull(),
  startTime: text("start_time").notNull(), // ISO String
  durationMinutes: integer("duration_minutes").default(60).notNull(),
  room: text("room").default("Studio A").notNull(),
  status: text("status", { enum: ["scheduled", "in_progress", "completed", "cancelled"] }).default("scheduled").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

// 6. Bookings Table
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  classId: text("class_id").references(() => classes.id).notNull(),
  memberId: text("member_id").references(() => members.id).notNull(),
  status: text("status", { enum: ["confirmed", "cancelled", "attended", "no_show"] }).default("confirmed").notNull(),
  paymentType: text("payment_type", { enum: ["personal_credit", "corporate_credit", "membership_allowance"] }).notNull(),
  creditsDeducted: integer("credits_deducted").notNull(),
  checkInTime: text("check_in_time"),
  bookedAt: text("booked_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  cancelledAt: text("cancelled_at"),
});

// 7. Waitlists Table
export const waitlists = sqliteTable("waitlists", {
  id: text("id").primaryKey(),
  classId: text("class_id").references(() => classes.id).notNull(),
  memberId: text("member_id").references(() => members.id).notNull(),
  position: integer("position").notNull(),
  status: text("status", { enum: ["waiting", "promoted", "cancelled"] }).default("waiting").notNull(),
  joinedAt: text("joined_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  promotedAt: text("promoted_at"),
});

// 8. Transactions Table
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  memberId: text("member_id").references(() => members.id),
  companyId: text("company_id").references(() => companies.id),
  type: text("type", { 
    enum: ["membership_renewal", "credit_purchase", "class_booking", "class_cancellation_refund", "corporate_grant", "manual_adjustment"] 
  }).notNull(),
  amount: real("amount").default(0.0).notNull(),
  credits: integer("credits").default(0).notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});
