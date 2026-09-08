import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { categories, InsertUser, orderItems, orders, products, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };

  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.id);
}

export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      categoryId: products.categoryId,
      categoryName: categories.name,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      badge: products.badge,
      emoji: products.emoji,
      accent: products.accent,
      stock: products.stock,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.id));
}

type NewOrder = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ productId: number; quantity: number }>;
};

export async function createOrder(input: NewOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  return db.transaction(async (tx) => {
    const productIds = input.items.map((item) => item.productId);
    const rows = await tx.select().from(products).where(inArray(products.id, productIds));
    const byId = new Map(rows.map((product) => [product.id, product]));

    const normalizedItems = input.items.map((item) => {
      const product = byId.get(item.productId);
      if (!product) throw new Error("One of the selected products no longer exists");
      if (item.quantity < 1 || item.quantity > product.stock) {
        throw new Error(`الكمية المتاحة من ${product.name} غير كافية`);
      }
      return { product, quantity: item.quantity };
    });

    const total = normalizedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderResult = await tx.insert(orders).values({
      customerName: input.customerName,
      phone: input.phone,
      city: input.city,
      address: input.address,
      notes: input.notes || null,
      total,
    });
    const orderId = Number(orderResult[0].insertId);

    await tx.insert(orderItems).values(
      normalizedItems.map(({ product, quantity }) => ({
        orderId,
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
      })),
    );

    return { orderId, total };
  });
}
