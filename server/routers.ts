import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createOrder, getCategories, getProducts } from "./db";

const demoProducts = [
  { id: 1, name: "طقم كتان صيفي", slug: "linen-set", description: "قميص وبنطال بخامة خفيفة لأيام الصيف الهادئة.", categoryId: 3, categoryName: "ملابس نسائي", price: 34900, compareAtPrice: 42000, badge: "الأكثر طلبًا", emoji: "✦", accent: "#EED9C8", stock: 18 },
  { id: 2, name: "طقم المستكشف الصغير", slug: "mini-explorer", description: "قطعتان مريحتان للحركة واللعب طوال اليوم.", categoryId: 1, categoryName: "ملابس ولادي", price: 28500, compareAtPrice: null, badge: "وصل حديثًا", emoji: "◌", accent: "#DDEAE0", stock: 12 },
  { id: 3, name: "حذاء يومي خفيف", slug: "soft-knit", description: "مظهر أنيق وراحة تمشي معك من الصباح للمساء.", categoryId: 7, categoryName: "أحذية وحقائب", price: 52900, compareAtPrice: 62000, badge: "خصم 15%", emoji: "↗", accent: "#E5E0D8", stock: 9 },
  { id: 4, name: "حقيبة المدينة", slug: "city-essentials", description: "مساحة مرتبة لتفاصيلك اليومية، بتصميم عملي وهادئ.", categoryId: 2, categoryName: "ملابس رجالي", price: 45900, compareAtPrice: null, badge: "اختيار نُقطة", emoji: "□", accent: "#DDE6EF", stock: 22 },
  { id: 5, name: "طقم أواني خزفي", slug: "ceramic-set", description: "تفاصيل بسيطة تجعل سفرتك أقرب وأجمل.", categoryId: 5, categoryName: "أواني ومنزل", price: 63900, compareAtPrice: null, badge: "للبيت", emoji: "○", accent: "#F1E2CF", stock: 7 },
  { id: 6, name: "صندوق عناية بالبيت", slug: "clean-home", description: "أساسيات التنظيف اليومية في باقة واحدة مرتبة.", categoryId: 6, categoryName: "تنظيف وعناية", price: 21900, compareAtPrice: 26000, badge: "قيمة أفضل", emoji: "+", accent: "#DDECE2", stock: 31 },
  { id: 7, name: "مزهرية من معرض صغير", slug: "gallery-vase", description: "قطعة فنية يدوية تمنح الزاوية معنى خاصًا.", categoryId: 8, categoryName: "تحف فنية", price: 87500, compareAtPrice: null, badge: "قطعة محدودة", emoji: "✺", accent: "#EADBDC", stock: 3 },
  { id: 8, name: "حذاء أول خطوة", slug: "daily-sneaker", description: "نعل مرن وملمس لطيف للأقدام الصغيرة.", categoryId: 4, categoryName: "ملابس مواليد", price: 17900, compareAtPrice: null, badge: "للصغار", emoji: "♡", accent: "#E7E0F0", stock: 16 },
];

const demoCategories = [
  { id: 1, name: "ملابس ولادي", slug: "kids" },
  { id: 2, name: "ملابس رجالي", slug: "men" },
  { id: 3, name: "ملابس نسائي", slug: "women" },
  { id: 4, name: "ملابس مواليد", slug: "newborn" },
  { id: 5, name: "أواني ومنزل", slug: "home" },
  { id: 6, name: "تنظيف وعناية", slug: "care" },
  { id: 7, name: "أحذية وحقائب", slug: "shoes" },
  { id: 8, name: "تحف فنية", slug: "art" },
  { id: 9, name: "إلكترونيات", slug: "tech" },
  { id: 10, name: "هدايا ومناسبات", slug: "gifts" },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: router({
    list: publicProcedure.query(async () => {
      const rows = await getProducts();
      return rows.length > 0 ? rows : demoProducts;
    }),
    categories: publicProcedure.query(async () => {
      const rows = await getCategories();
      return rows.length > 0 ? rows : demoCategories;
    }),
  }),
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string().min(2).max(160),
        phone: z.string().min(8).max(40),
        city: z.string().min(2).max(100),
        address: z.string().min(5).max(500),
        notes: z.string().max(500).optional(),
        items: z.array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1).max(20) })).min(1),
      }))
      .mutation(async ({ input }) => createOrder(input)),
  }),
});

export type AppRouter = typeof appRouter;
