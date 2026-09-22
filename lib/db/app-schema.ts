import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const memberRoleValues = ["creator", "brand"] as const;
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

export const memberProfileRelations = relations(memberProfile, ({ one, many }) => ({
  user: one(user, { fields: [memberProfile.userId], references: [user.id] }),
  packages: many(creatorPackage),
  jobPosts: many(brandJobPost),
}));

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
