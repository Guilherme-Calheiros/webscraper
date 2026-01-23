ALTER TABLE "history_prices" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_alerts" ALTER COLUMN "current_price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "product_alerts" ALTER COLUMN "target_price" SET DATA TYPE numeric(10, 2);