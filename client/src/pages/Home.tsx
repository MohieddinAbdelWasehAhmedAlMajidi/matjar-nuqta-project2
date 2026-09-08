import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Baby,
  Banknote,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Heart,
  House,
  LayoutGrid,
  Menu,
  PackageCheck,
  Palette,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { startLogin } from "@/const";

const currency = (value: number) =>
  new Intl.NumberFormat("ar-IQ", {
    style: "currency",
    currency: "IQD",
    maximumFractionDigits: 0,
  }).format(value);

type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  badge: string | null;
  emoji: string;
  accent: string;
  stock: number;
  image: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  eyebrow: string;
  icon: LucideIcon;
  color: string;
};

const imageMap: Record<string, string> = {
  "linen-set": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85",
  "mini-explorer": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85",
  "soft-knit": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  "city-essentials": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
  "ceramic-set": "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85",
  "clean-home": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=85",
  "gallery-vase": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85",
  "daily-sneaker": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  "default": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85",
};

const categories: Category[] = [
  { id: 1, name: "ملابس ولادي", slug: "kids", eyebrow: "أناقة صغيرة", icon: Baby, color: "#E5F1EA" },
  { id: 2, name: "ملابس رجالي", slug: "men", eyebrow: "أساسيات يومية", icon: UserRound, color: "#E3ECF5" },
  { id: 3, name: "ملابس نسائي", slug: "women", eyebrow: "تفاصيل ناعمة", icon: Sparkles, color: "#F7E5E0" },
  { id: 4, name: "ملابس مواليد", slug: "newborn", eyebrow: "أول الذكريات", icon: Heart, color: "#F4EAF6" },
  { id: 5, name: "أواني ومنزل", slug: "home", eyebrow: "بيت أدفأ", icon: House, color: "#F5E9D5" },
  { id: 6, name: "تنظيف وعناية", slug: "care", eyebrow: "يوم أخف", icon: Zap, color: "#E5F1EC" },
  { id: 7, name: "أحذية وحقائب", slug: "shoes", eyebrow: "خطوتك القادمة", icon: ShoppingBag, color: "#EDE8DF" },
  { id: 8, name: "تحف فنية", slug: "art", eyebrow: "قطعة لها حكاية", icon: Palette, color: "#F4E4E3" },
  { id: 9, name: "إلكترونيات", slug: "tech", eyebrow: "أذكى كل يوم", icon: Bell, color: "#E8EDF8" },
  { id: 10, name: "هدايا ومناسبات", slug: "gifts", eyebrow: "على ذوقك", icon: Star, color: "#F8EDD8" },
];

const demoProducts: StoreProduct[] = [
  { id: 1, name: "طقم كتان صيفي", slug: "linen-set", description: "قميص وبنطال بخامة خفيفة لأيام الصيف الهادئة.", categoryId: 3, categoryName: "ملابس نسائي", price: 34900, compareAtPrice: 42000, badge: "الأكثر طلبًا", emoji: "✦", accent: "#EED9C8", stock: 18, image: imageMap["linen-set"] },
  { id: 2, name: "طقم المستكشف الصغير", slug: "mini-explorer", description: "قطعتان مريحتان للحركة واللعب طوال اليوم.", categoryId: 1, categoryName: "ملابس ولادي", price: 28500, compareAtPrice: null, badge: "وصل حديثًا", emoji: "◌", accent: "#DDEAE0", stock: 12, image: imageMap["mini-explorer"] },
  { id: 3, name: "حذاء يومي خفيف", slug: "soft-knit", description: "مظهر أنيق وراحة تمشي معك من الصباح للمساء.", categoryId: 7, categoryName: "أحذية وحقائب", price: 52900, compareAtPrice: 62000, badge: "خصم 15%", emoji: "↗", accent: "#E5E0D8", stock: 9, image: imageMap["soft-knit"] },
  { id: 4, name: "حقيبة المدينة", slug: "city-essentials", description: "مساحة مرتبة لتفاصيلك اليومية، بتصميم عملي وهادئ.", categoryId: 2, categoryName: "ملابس رجالي", price: 45900, compareAtPrice: null, badge: "اختيار نُقطة", emoji: "□", accent: "#DDE6EF", stock: 22, image: imageMap["city-essentials"] },
  { id: 5, name: "طقم أواني خزفي", slug: "ceramic-set", description: "تفاصيل بسيطة تجعل سفرتك أقرب وأجمل.", categoryId: 5, categoryName: "أواني ومنزل", price: 63900, compareAtPrice: null, badge: "للبيت", emoji: "○", accent: "#F1E2CF", stock: 7, image: imageMap["ceramic-set"] },
  { id: 6, name: "صندوق عناية بالبيت", slug: "clean-home", description: "أساسيات التنظيف اليومية في باقة واحدة مرتبة.", categoryId: 6, categoryName: "تنظيف وعناية", price: 21900, compareAtPrice: 26000, badge: "قيمة أفضل", emoji: "+", accent: "#DDECE2", stock: 31, image: imageMap["clean-home"] },
  { id: 7, name: "مزهرية من معرض صغير", slug: "gallery-vase", description: "قطعة فنية يدوية تمنح الزاوية معنى خاصًا.", categoryId: 8, categoryName: "تحف فنية", price: 87500, compareAtPrice: null, badge: "قطعة محدودة", emoji: "✺", accent: "#EADBDC", stock: 3, image: imageMap["gallery-vase"] },
  { id: 8, name: "حذاء أول خطوة", slug: "daily-sneaker", description: "نعل مرن وملمس لطيف للأقدام الصغيرة.", categoryId: 4, categoryName: "ملابس مواليد", price: 17900, compareAtPrice: null, badge: "للصغار", emoji: "♡", accent: "#E7E0F0", stock: 16, image: imageMap["daily-sneaker"] },
];

function Logo() {
  return (
    <div className="flex items-center gap-3" dir="rtl">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#173F35] text-[#F8F2E8] shadow-[0_10px_24px_rgba(23,63,53,0.18)]">
        <span className="text-[23px] font-black tracking-[-0.14em]">ن</span>
        <span className="absolute bottom-[9px] left-[9px] h-1.5 w-1.5 rounded-full bg-[#E8AF56]" />
      </div>
      <div className="leading-none">
        <p className="font-display text-[21px] font-bold tracking-[-0.04em] text-[#173F35]">نُقطة</p>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.16em] text-[#7E8A83]">كل شيء في مكانه</p>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: StoreProduct; onAdd: (product: StoreProduct) => void }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[0.86] overflow-hidden rounded-[24px] bg-[#F1EDE5]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.badge ? <span className="rounded-full bg-[#FFFDF8]/90 px-3 py-1.5 text-[11px] font-bold text-[#173F35] backdrop-blur">{product.badge}</span> : <span />}
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF8]/85 text-[#173F35] backdrop-blur transition hover:bg-[#173F35] hover:text-white" aria-label={`أضف ${product.name} للمفضلة`}>
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => onAdd(product)} className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-[#173F35] py-3 text-xs font-bold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#245B4B]">
          <ShoppingBag className="h-4 w-4" /> أضف للسلة
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3" dir="rtl">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold text-[#9A7650]">{product.categoryName}</p>
          <h3 className="truncate text-[15px] font-bold text-[#173F35]">{product.name}</h3>
          <p className="mt-1 truncate text-xs text-[#7A847D]">{product.description}</p>
        </div>
        <div className="shrink-0 text-left">
          <p className="text-[15px] font-extrabold text-[#173F35]">{currency(product.price)}</p>
          {product.compareAtPrice && <p className="mt-1 text-[11px] text-[#A5ADA7] line-through">{currency(product.compareAtPrice)}</p>}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const productsQuery = trpc.products.list.useQuery();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<StoreProduct[]>(() => {
    try {
      const stored = localStorage.getItem("nuqta-cart");
      return stored ? (JSON.parse(stored) as StoreProduct[]) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("nuqta-cart", JSON.stringify(cart));
  }, [cart]);

  const products = useMemo(() => {
    const remote = productsQuery.data ?? [];
    if (!remote.length) return demoProducts;
    return remote.map((product) => ({
      ...product,
      categoryName: product.categoryName || "اختيارات نُقطة",
      image: imageMap[product.slug] || imageMap.default,
    })) as StoreProduct[];
  }, [productsQuery.data]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || String(product.categoryId) === activeCategory;
      const matchesSearch = !query || `${product.name} ${product.description} ${product.categoryName}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, search]);

  const addToCart = (product: StoreProduct) => {
    setCart((current) => [...current, product]);
    setCartOpen(true);
  };

  const scrollToProducts = () => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF9F5] text-[#173F35]" dir="rtl">
      <div className="bg-[#173F35] px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-[#F6F1E7]">شحن مجاني للطلبات فوق ١٠٠,٠٠٠ د.ع · تسوق من أي مكان في العالم</div>
      <header className="sticky top-0 z-30 border-b border-[#EDE8DF] bg-[#FBF9F5]/90 backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-[13px] font-bold text-[#53625A] lg:flex">
            <a href="#categories" className="transition hover:text-[#173F35]">الأقسام</a>
            <a href="#featured" className="transition hover:text-[#173F35]">مختاراتنا</a>
            <a href="#how-it-works" className="transition hover:text-[#173F35]">كيف نعمل؟</a>
            <a href="#about" className="transition hover:text-[#173F35]">عن نُقطة</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLocation("/seller")} className="hidden items-center gap-2 rounded-full border border-[#D8E1DB] px-4 py-2.5 text-xs font-bold text-[#173F35] transition hover:border-[#173F35] md:flex"><LayoutGrid className="h-4 w-4" /> لوحة المتجر</button>
            <button onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F1ECE3] transition hover:bg-[#E7DFD2]" aria-label="السلة"><ShoppingBag className="h-[18px] w-[18px]" />{cart.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8AF56] text-[10px] font-black text-[#173F35]">{cart.length}</span>}</button>
            <button onClick={() => setMobileMenu((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D7] lg:hidden" aria-label="فتح القائمة">{mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        {mobileMenu && <div className="border-t border-[#EDE8DF] bg-[#FBF9F5] px-5 py-4 lg:hidden"><div className="flex flex-col gap-4 text-sm font-bold"><a href="#categories" onClick={() => setMobileMenu(false)}>الأقسام</a><a href="#featured" onClick={() => setMobileMenu(false)}>مختاراتنا</a><button className="text-right" onClick={() => setLocation("/seller")}>لوحة المتجر</button></div></div>}
      </header>

      <main>
        <section className="container grid gap-8 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E3D5BE] bg-[#FFF9EF] px-3 py-2 text-[11px] font-bold text-[#9A7650]"><Sparkles className="h-3.5 w-3.5" /> متجر عالمي بذوق محلي</div>
            <h1 className="max-w-[620px] font-display text-[42px] font-bold leading-[1.16] tracking-[-0.06em] text-[#173F35] sm:text-[58px] lg:text-[70px]">كل ما تحب،<br /><span className="text-[#B47E44]">في نُقطة واحدة.</span></h1>
            <p className="mt-6 max-w-[490px] text-[16px] leading-8 text-[#65726B]">من الملابس إلى تفاصيل البيت والهدايا الفنية. اكتشف اختيارات صُنعت لتصل إليك بسهولة، أينما كنت.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={scrollToProducts} className="h-12 rounded-full bg-[#173F35] px-7 text-sm font-bold text-white shadow-[0_12px_24px_rgba(23,63,53,0.18)] hover:bg-[#245B4B]">اكتشف المختارات <ArrowLeft className="h-4 w-4" /></Button>
              <button onClick={() => setLocation("/seller")} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#D8E1DB] px-6 text-sm font-bold text-[#173F35] transition hover:bg-white">أنا صاحب متجر <ArrowUpLeft className="h-4 w-4" /></button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#EDE8DF] pt-6 text-xs font-semibold text-[#7D887F]">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#9A7650]" /> دفع آمن</span><span className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#9A7650]" /> توصيل موثوق</span><span className="flex items-center gap-2"><CircleHelp className="h-4 w-4 text-[#9A7650]" /> دعم إنساني</span>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-[#E8EEE7] lg:min-h-[560px]">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=90" alt="تجربة تسوق نُقطة" className="h-full min-h-[420px] w-full object-cover mix-blend-multiply opacity-90 lg:min-h-[560px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173F35]/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between gap-4 text-white"><div><p className="text-[11px] font-bold tracking-widest text-[#F1D6A8]">THE WORLD, CURATED</p><p className="mt-2 text-2xl font-bold">اختيارات حولك، بروح نُقطة.</p></div><div className="hidden rounded-full bg-white/15 p-3 backdrop-blur md:block"><ArrowUpLeft className="h-6 w-6" /></div></div>
            <div className="absolute left-5 top-5 rounded-2xl bg-[#FFFDF8]/90 p-4 text-right shadow-lg backdrop-blur"><p className="text-[11px] font-bold text-[#9A7650]">وصل حديثًا</p><p className="mt-1 text-sm font-bold text-[#173F35]">تفاصيل تستحق الاكتشاف</p></div>
          </div>
        </section>

        <section id="categories" className="border-y border-[#EDE8DF] bg-[#F3F0E9] py-16 lg:py-20">
          <div className="container"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold tracking-[0.18em] text-[#B47E44]">تسوّق حسب ذوقك</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-[#173F35] lg:text-4xl">أقسام لكل تفاصيل الحياة</h2></div><button onClick={() => { setActiveCategory("all"); scrollToProducts(); }} className="hidden items-center gap-2 text-xs font-bold text-[#6F7D75] transition hover:text-[#173F35] sm:flex">عرض الكل <ArrowLeft className="h-4 w-4" /></button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{categories.map((category) => { const Icon = category.icon; return <button key={category.id} onClick={() => { setActiveCategory(String(category.id)); scrollToProducts(); }} className="group min-h-[142px] rounded-[20px] p-4 text-right transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(23,63,53,0.08)]" style={{ backgroundColor: category.color }}><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#173F35]"><Icon className="h-5 w-5" /></div><ArrowUpLeft className="h-4 w-4 text-[#748078] opacity-60 transition group-hover:translate-x-[-3px] group-hover:translate-y-[3px]" /></div><p className="mt-7 text-[15px] font-bold text-[#173F35]">{category.name}</p><p className="mt-1 text-[10px] font-semibold text-[#76837A]">{category.eyebrow}</p></button>; })}</div></div>
        </section>

        <section id="featured" className="container py-16 lg:py-24">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[11px] font-bold tracking-[0.18em] text-[#B47E44]">منتقاة بعناية</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] text-[#173F35] lg:text-4xl">مختارات هذا الأسبوع</h2></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative"><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA49D]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن شيء تحبه" className="h-11 w-full rounded-full border-[#E2DED4] bg-white pr-10 text-right text-xs focus-visible:ring-[#173F35] sm:w-56" /></div><div className="flex items-center gap-1 overflow-auto rounded-full border border-[#E2DED4] bg-white p-1">{[{ value: "all", label: "الكل" }, ...categories.slice(0, 4).map((category) => ({ value: String(category.id), label: category.name.replace("ملابس ", "") }))].map((item) => <button key={item.value} onClick={() => setActiveCategory(item.value)} className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold transition ${activeCategory === item.value ? "bg-[#173F35] text-white" : "text-[#77847B] hover:bg-[#F4F0E9]"}`}>{item.label}</button>)}</div></div></div>
          {filteredProducts.length === 0 ? <div className="mt-10 rounded-[24px] border border-dashed border-[#D8E1DB] bg-[#F7F5EF] p-12 text-center"><p className="font-bold">لم نجد منتجات مطابقة</p><button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-3 text-sm font-bold text-[#B47E44]">عرض كل المنتجات</button></div> : <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>}
        </section>

        <section id="how-it-works" className="container pb-16 lg:pb-24"><div className="grid overflow-hidden rounded-[30px] bg-[#173F35] text-[#F8F2E8] lg:grid-cols-[0.85fr_1.15fr]"><div className="relative min-h-[270px] overflow-hidden lg:min-h-[340px]"><img src="https://images.unsplash.com/photo-1607082348824-0a96f2a8b3a3?auto=format&fit=crop&w=1000&q=85" alt="تغليف طلبات نُقطة" className="h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-[#173F35]/60 to-transparent" /></div><div className="flex flex-col justify-center p-8 lg:p-14"><p className="text-[11px] font-bold tracking-[0.18em] text-[#E8AF56]">نُقطة تصل إليك</p><h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] lg:text-4xl">تسوق أبسط.<br />اكتشاف أمتع.</h2><div className="mt-8 grid gap-6 sm:grid-cols-3"><div><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E8AF56]">١</div><p className="text-sm font-bold">اختر ما تحب</p><p className="mt-1 text-xs leading-6 text-[#B8C8BF]">من بائعين وأقسام متنوعة.</p></div><div><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E8AF56]">٢</div><p className="text-sm font-bold">اطلب بثقة</p><p className="mt-1 text-xs leading-6 text-[#B8C8BF]">دفع آمن وتحديثات واضحة.</p></div><div><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E8AF56]">٣</div><p className="text-sm font-bold">استلم بسعادة</p><p className="mt-1 text-xs leading-6 text-[#B8C8BF]">توصيل موثوق إلى بابك.</p></div></div></div></div></section>

        <section id="about" className="border-t border-[#EDE8DF] bg-[#F3F0E9] py-14"><div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><div className="flex items-center gap-3"><Logo /><span className="hidden h-5 w-px bg-[#D7D2C8] md:block" /><p className="text-xs text-[#7B857D]">من بيت صغير إلى العالم.</p></div></div><div className="flex flex-wrap gap-5 text-xs font-semibold text-[#7B857D]"><a href="#about" className="hover:text-[#173F35]">قصتنا</a><a href="#how-it-works" className="hover:text-[#173F35]">الشحن والتوصيل</a><a href="#about" className="hover:text-[#173F35]">تواصل معنا</a><button onClick={() => startLogin()} className="font-bold text-[#173F35]">تسجيل الدخول</button></div></div></section>
      </main>

      {cartOpen && <div className="fixed inset-0 z-50"><button onClick={() => setCartOpen(false)} className="absolute inset-0 bg-[#173F35]/35 backdrop-blur-sm" aria-label="إغلاق السلة" /><aside className="absolute bottom-0 left-0 top-0 flex w-full max-w-md flex-col bg-[#FBF9F5] p-6 shadow-2xl sm:right-0 sm:left-auto" dir="rtl"><div className="flex items-center justify-between border-b border-[#EDE8DF] pb-5"><div><p className="text-[11px] font-bold tracking-widest text-[#B47E44]">سلة المشتريات</p><h2 className="mt-1 text-2xl font-bold">اختياراتك</h2></div><button onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1ECE3]"><X className="h-4 w-4" /></button></div>{cart.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag className="h-10 w-10 text-[#B8C1BA]" /><p className="mt-4 font-bold">السلة فارغة</p><p className="mt-2 text-sm text-[#7A847D]">ابدأ بإضافة شيء يعجبك.</p></div> : <><div className="flex-1 space-y-4 overflow-auto py-6">{cart.map((item, index) => <div key={`${item.id}-${index}`} className="flex gap-3 border-b border-[#EDE8DF] pb-4"><img src={item.image} alt="" className="h-16 w-16 rounded-2xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-[#7A847D]">قطعة واحدة</p><p className="mt-2 text-sm font-extrabold text-[#B47E44]">{currency(item.price)}</p></div><button onClick={() => setCart((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="self-start text-[#A7B0AA] hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div>)}</div><div className="border-t border-[#EDE8DF] pt-5"><div className="mb-4 flex items-center justify-between"><span className="text-sm text-[#7A847D]">المجموع</span><strong className="text-xl">{currency(cartTotal)}</strong></div><Button onClick={() => setLocation("/checkout")} className="h-12 w-full rounded-full bg-[#173F35] font-bold hover:bg-[#245B4B]">إتمام الطلب <ArrowLeft className="h-4 w-4" /></Button><p className="mt-3 text-center text-[10px] text-[#9AA49D]">سيتم تأكيد العنوان والدفع في الخطوة التالية</p></div></>}</aside></div>}
    </div>
  );
}
