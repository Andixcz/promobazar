import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import type { CreatorPlatformId } from "@/lib/dashboard/creator-platform";

import { user } from "./auth-schema";

export const memberRoleValues = ["creator", "brand", "buyer"] as const;
export type MemberRole = (typeof memberRoleValues)[number];

/** Veřejný profil značky / tvůrce (1:1 s uživatelem Better Auth). */
export const memberProfile = pgTable(
  "member_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    role: text("role").notNull().$type<MemberRole>(),
    displayName: text("display_name"),
    bio: text("bio"),
    category: text("category").default("fitness"),
    avatarUrl: text("avatar_url"),
    bannerUrl: text("banner_url"),
    socialTiktok: text("social_tiktok"),
    socialInstagram: text("social_instagram"),
    socialYoutube: text("social_youtube"),
    portfolioUrls: jsonb("portfolio_urls").$type<string[]>().default([]).notNull(),
    profileViews: integer("profile_views").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("member_profile_slug_idx").on(table.slug)],
);

/** OAuth propojení tvůrce s Twitch / Kick / TikTok / Instagram (mimo Better Auth). */
export const creatorPlatformLink = pgTable(
  "creator_platform_link",
  {
    userId: text("user_id")
      .notNull()
      .references(() => memberProfile.userId, { onDelete: "cascade" }),
    platform: text("platform").notNull().$type<CreatorPlatformId>(),
    platformUserId: text("platform_user_id").notNull(),
    username: text("username").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    connectedAt: timestamp("connected_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.platform] }),
    index("creator_platform_link_user_idx").on(table.userId),
  ],
);

export const creatorPackage = pgTable(
  "creator_package",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => memberProfile.userId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    format: text("format").notNull(),
    deliveryDays: integer("delivery_days").default(7).notNull(),
    revisions: integer("revisions").default(1).notNull(),
    licenseDays: text("license_days").default("30").notNull(),
    priceCzk: integer("price_czk").notNull(),
    description: text("description").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("creator_package_user_idx").on(table.userId)],
);

export const brandJobPost = pgTable(
  "brand_job_post",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => memberProfile.userId, { onDelete: "cascade" }),
    title: text("title").notNull(),
    category: text("category").notNull(),
    budgetCzk: integer("budget_czk").notNull(),
    description: text("description").notNull(),
    status: text("status").default("open").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("brand_job_post_user_idx").on(table.userId)],
);

export const marketplaceOrderStatusValues = [
  "pending_payment",
  "paid",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
  "disputed",
] as const;
export type MarketplaceOrderStatus =
  (typeof marketplaceOrderStatusValues)[number];

/** Objednávka balíčku / spolupráce mezi zákazníkem (značka nebo nakupující) a tvůrcem. */
export const marketplaceOrder = pgTable(
  "marketplace_order",
  {
    id: text("id").primaryKey(),
    creatorUserId: text("creator_user_id")
      .notNull()
      .references(() => memberProfile.userId, { onDelete: "cascade" }),
    clientUserId: text("client_user_id")
      .notNull()
      .references(() => memberProfile.userId, { onDelete: "cascade" }),
    title: text("title").notNull(),
    amountCzk: integer("amount_czk").notNull(),
    status: text("status")
      .notNull()
      .default("pending_payment")
      .$type<MarketplaceOrderStatus>(),
    packageId: text("package_id").references(() => creatorPackage.id, {
      onDelete: "set null",
    }),
    jobPostId: text("job_post_id").references(() => brandJobPost.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("marketplace_order_creator_idx").on(table.creatorUserId),
    index("marketplace_order_client_idx").on(table.clientUserId),
    index("marketplace_order_status_idx").on(table.status),
  ],
);

export const memberProfileRelations = relations(memberProfile, ({ one, many }) => ({
  user: one(user, { fields: [memberProfile.userId], references: [user.id] }),
  platformLinks: many(creatorPlatformLink),
  packages: many(creatorPackage),
  jobPosts: many(brandJobPost),
  ordersAsCreator: many(marketplaceOrder, { relationName: "orderCreator" }),
  ordersAsClient: many(marketplaceOrder, { relationName: "orderClient" }),
}));

export const creatorPlatformLinkRelations = relations(
  creatorPlatformLink,
  ({ one }) => ({
    profile: one(memberProfile, {
      fields: [creatorPlatformLink.userId],
      references: [memberProfile.userId],
    }),
  }),
);

export const creatorPackageRelations = relations(creatorPackage, ({ one }) => ({
  profile: one(memberProfile, {
    fields: [creatorPackage.userId],
    references: [memberProfile.userId],
  }),
}));

export const brandJobPostRelations = relations(brandJobPost, ({ one }) => ({
  profile: one(memberProfile, {
    fields: [brandJobPost.userId],
    references: [memberProfile.userId],
  }),
}));

export const marketplaceOrderRelations = relations(
  marketplaceOrder,
  ({ one }) => ({
    creator: one(memberProfile, {
      fields: [marketplaceOrder.creatorUserId],
      references: [memberProfile.userId],
      relationName: "orderCreator",
    }),
    client: one(memberProfile, {
      fields: [marketplaceOrder.clientUserId],
      references: [memberProfile.userId],
      relationName: "orderClient",
    }),
    package: one(creatorPackage, {
      fields: [marketplaceOrder.packageId],
      references: [creatorPackage.id],
    }),
    jobPost: one(brandJobPost, {
      fields: [marketplaceOrder.jobPostId],
      references: [brandJobPost.id],
    }),
  }),
);

