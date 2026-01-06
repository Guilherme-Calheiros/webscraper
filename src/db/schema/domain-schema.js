import { sql } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const productAlert = sqliteTable("product_alerts", {
  id: integer("id").primaryKey(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  productUrl: text("product_url").notNull(),
  currentPrice: real("current_price").notNull(),
  targetPrice: real("target_price").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(strftime('%s','now'))`),
  isActive: integer("is_active").notNull().default(1),
});

export const historyPrice = sqliteTable("history_prices", {
  id: integer("id").primaryKey(),
  productAlertId: integer("product_alert_id")
    .notNull()
    .references(() => productAlert.id),
  price: real("price").notNull(),
  recordedAt: integer("recorded_at")
    .notNull()
    .default(sql`(strftime('%s','now'))`),
});