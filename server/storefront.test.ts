import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("storefront", () => {
  it("returns a multi-category product catalog", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.products.list();

    expect(products.length).toBeGreaterThanOrEqual(6);
    expect(products.some((product) => product.categoryName === "ملابس نسائي")).toBe(true);
    expect(products.some((product) => product.categoryName === "تحف فنية")).toBe(true);
  });

  it("returns the expanded category list", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const categories = await caller.products.categories();

    expect(categories.length).toBeGreaterThanOrEqual(8);
    expect(categories.map((category) => category.name)).toContain("أحذية وحقائب");
    expect(categories.map((category) => category.name)).toContain("تنظيف وعناية");
  });

  it("rejects an order without items", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.orders.create({
        customerName: "عميل تجريبي",
        phone: "07800000000",
        city: "بغداد",
        address: "شارع تجريبي ١",
        items: [],
      }),
    ).rejects.toThrow();
  });
});
