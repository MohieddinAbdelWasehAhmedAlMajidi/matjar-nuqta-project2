import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowRight,
  Bell,
  Boxes,
  Check,
  ChevronLeft,
  CircleHelp,
  Clock3,
  DollarSign,
  Download,
  Ellipsis,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Store,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const stats = [
  { label: "مبيعات هذا الشهر", value: "٢,٨٤٠,٠٠٠ د.ع", change: "+١٨.٤٪", icon: DollarSign, tone: "mint" },
  { label: "الطلبات الجديدة", value: "١٢٨", change: "+١٢ اليوم", icon: ShoppingBag, tone: "gold" },
  { label: "العملاء النشطون", value: "٣,٤٦٠", change: "+٨.٢٪", icon: Users, tone: "blue" },
  { label: "منتجات المتجر", value: "٢٤٦", change: "١١ منخفضة", icon: Boxes, tone: "rose" },
];

const orders = [
  { id: "#NQ-1842", customer: "سارة محمد", items: "طقم كتان صيفي + ٢", total: "١٢٤,٨٠٠ د.ع", status: "جديد", date: "منذ ١٢ دقيقة", color: "new" },
  { id: "#NQ-1841", customer: "عمر الخطيب", items: "حقيبة المدينة", total: "٤٥,٩٠٠ د.ع", status: "قيد التجهيز", date: "منذ ٤٥ دقيقة", color: "progress" },
  { id: "#NQ-1840", customer: "ليان أحمد", items: "مزهرية من معرض صغير", total: "٨٧,٥٠٠ د.ع", status: "تم الشحن", date: "أمس، ٠٤:٢٢ م", color: "shipped" },
  { id: "#NQ-1839", customer: "محمود علي", items: "صندوق عناية بالبيت + ١", total: "٦٦,٨٠٠ د.ع", status: "مكتمل", date: "أمس، ١١:١٠ ص", color: "done" },
];

const navItems = [
  { label: "نظرة عامة", icon: LayoutDashboard },
  { label: "الطلبات", icon: ShoppingBag, count: 12 },
  { label: "المنتجات", icon: Boxes },
  { label: "العملاء", icon: Users },
  { label: "رسائل المساعدة", icon: MessageCircle, count: 4 },
];

export default function Seller() {
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState("نظرة عامة");
  const [mobileNav, setMobileNav] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F3] text-[#183D34]" dir="rtl">
      <aside className={`fixed bottom-0 right-0 top-0 z-40 w-[270px] border-l border-[#E3E8E3] bg-[#FBFCFA] p-5 transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between"><button onClick={() => setLocation("/")} className="flex items-center gap-3 text-right"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F35] text-xl font-black text-[#F8F2E8]">ن</div><div><p className="text-lg font-black tracking-tight">نُقطة</p><p className="text-[10px] font-semibold text-[#87948C]">لوحة صاحب المتجر</p></div></button><button onClick={() => setMobileNav(false)} className="rounded-full p-2 hover:bg-[#F0F3EF] lg:hidden"><X className="h-4 w-4" /></button></div>
        <div className="mt-10 rounded-2xl bg-[#EEF5EF] p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D2E5D8] text-sm font-black text-[#173F35]">م</div><div><p className="text-sm font-bold">متجر أفق</p><p className="mt-1 text-[10px] text-[#748179]">منذ أبريل ٢٠٢٤</p></div><span className="mr-auto h-2 w-2 rounded-full bg-[#4B9B70]" /></div><div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#4C7660]"><Store className="h-3.5 w-3.5" /> المتجر يعمل الآن</div></div>
        <nav className="mt-8 space-y-1">{navItems.map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => { setActiveNav(item.label); setMobileNav(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-semibold transition ${activeNav === item.label ? "bg-[#173F35] text-white shadow-[0_8px_18px_rgba(23,63,53,0.14)]" : "text-[#6E7A72] hover:bg-[#F0F3EF] hover:text-[#173F35]"}`}><Icon className="h-[18px] w-[18px]" /><span className="flex-1">{item.label}</span>{item.count && <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeNav === item.label ? "bg-white/15 text-white" : "bg-[#F1E4C9] text-[#A47638]"}`}>{item.count}</span>}</button>; })}</nav>
        <div className="absolute bottom-5 right-5 left-5 border-t border-[#E7EBE7] pt-4"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78837B] hover:bg-[#F0F3EF]"><Settings2 className="h-[18px] w-[18px]" /> إعدادات المتجر</button><button onClick={() => setLocation("/")} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#78837B] hover:bg-[#F0F3EF]"><ArrowDownLeft className="h-[18px] w-[18px]" /> العودة للمتجر</button></div>
      </aside>
      {mobileNav && <button className="fixed inset-0 z-30 bg-[#183D34]/25 lg:hidden" onClick={() => setMobileNav(false)} aria-label="إغلاق القائمة" />}

      <div className="min-h-screen lg:mr-[270px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E3E8E3] bg-[#FBFCFA]/90 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-xl border border-[#E1E7E1] p-2 lg:hidden"><Menu className="h-5 w-5" /></button><div><p className="text-[11px] font-bold tracking-widest text-[#A47638]">الثلاثاء، ٨ سبتمبر ٢٠٢٦</p><h1 className="mt-1 text-xl font-black">صباح الخير، فريق أفق</h1></div></div><div className="flex items-center gap-2"><button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E1E7E1] bg-white"><Bell className="h-4 w-4 text-[#63736A]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C97952]" /></button><div className="hidden items-center gap-3 border-r border-[#E3E8E3] pr-4 sm:flex"><div className="text-left"><p className="text-xs font-bold">مريم صاحب</p><p className="mt-1 text-[10px] text-[#87948C]">مديرة المتجر</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCCA] text-sm font-black">م</div></div></div></header>
        <main className="p-5 lg:p-8">
          {activeNav !== "نظرة عامة" ? <section className="flex min-h-[600px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8E1DB] bg-[#FBFCFA] text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF5EF] text-[#173F35]"><Package className="h-7 w-7" /></div><h2 className="mt-5 text-2xl font-black">قسم {activeNav}</h2><p className="mt-2 max-w-sm text-sm leading-7 text-[#7A867E]">هذه المساحة جاهزة لتوسعة إدارة {activeNav} وربطها ببيانات المتجر الحقيقية.</p><Button onClick={() => setActiveNav("نظرة عامة")} className="mt-6 rounded-full bg-[#173F35] font-bold hover:bg-[#245B4B]">العودة للنظرة العامة</Button></section> : <>
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EEF5EF] px-3 py-1.5 text-[10px] font-bold text-[#4B8061]"><span className="h-1.5 w-1.5 rounded-full bg-[#4B9B70]" /> أداء ممتاز هذا الشهر</div><h2 className="text-3xl font-black tracking-tight">نظرة عامة</h2><p className="mt-2 text-sm text-[#7B877F]">هنا صورة سريعة عن حركة متجرك اليوم.</p></div><div className="flex gap-2"><Button variant="outline" className="h-10 rounded-full border-[#D9E1DA] bg-white px-4 text-xs font-bold text-[#486156]"><Download className="h-4 w-4" /> تقرير الشهر</Button><Button onClick={() => setShowAddProduct(true)} className="h-10 rounded-full bg-[#173F35] px-4 text-xs font-bold text-white hover:bg-[#245B4B]"><Plus className="h-4 w-4" /> إضافة منتج</Button></div></div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5 shadow-[0_4px_18px_rgba(27,60,47,0.025)]"><div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone === "mint" ? "bg-[#E0F0E4] text-[#4B8962]" : stat.tone === "gold" ? "bg-[#F8EBCF] text-[#B47E44]" : stat.tone === "blue" ? "bg-[#E6EEF7] text-[#52749B]" : "bg-[#F6E4DE] text-[#B96E59]"}`}><Icon className="h-[18px] w-[18px]" /></div><button className="text-[#A1ABA4]"><Ellipsis className="h-4 w-4" /></button></div><p className="mt-5 text-xs font-semibold text-[#7A867E]">{stat.label}</p><div className="mt-2 flex items-end justify-between gap-2"><p className="text-xl font-black tracking-tight">{stat.value}</p><span className="rounded-full bg-[#EEF5EF] px-2 py-1 text-[10px] font-bold text-[#4B8061]">{stat.change}</span></div></div>; })}</div>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]"><div className="rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5 lg:p-6"><div className="flex items-center justify-between"><div><h3 className="font-black">المبيعات خلال الشهر</h3><p className="mt-1 text-xs text-[#7A867E]">مقارنة بالأيام الثلاثين السابقة</p></div><button className="flex items-center gap-1 rounded-full border border-[#E2E8E2] px-3 py-2 text-[10px] font-bold text-[#66756B]">آخر ٣٠ يومًا <ChevronLeft className="h-3 w-3" /></button></div><div className="mt-8 flex h-[210px] items-end gap-2 border-b border-[#E8EDE8] pb-0 sm:gap-3">{[42, 58, 47, 74, 66, 82, 64, 91, 72, 88, 76, 98, 81, 92, 78, 100, 84, 96, 70, 86, 77, 93, 89, 100, 88, 97, 78, 92, 86, 94].map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-md transition hover:bg-[#B47E44] ${index > 24 ? "bg-[#8EB89A]" : "bg-[#D5E5D8]"}`} style={{ height: `${height}%` }} /></div>)}</div><div className="mt-3 flex justify-between text-[10px] font-semibold text-[#A1ABA4]"><span>١ أغسطس</span><span>١٥ أغسطس</span><span>٣٠ أغسطس</span></div></div><div className="rounded-2xl border border-[#E4EAE4] bg-[#173F35] p-6 text-[#F8F2E8]"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold tracking-widest text-[#E8AF56]">تحتاج انتباهك</p><h3 className="mt-3 text-xl font-black leading-8">١١ منتجًا<br />مخزونها منخفض</h3></div><div className="rounded-xl bg-white/10 p-2.5"><Boxes className="h-5 w-5 text-[#E8AF56]" /></div></div><p className="mt-5 text-xs leading-6 text-[#B7C9BF]">لا تدع أفضل منتجاتك تنفد. راجع المخزون وأضف الكميات المطلوبة.</p><button onClick={() => setActiveNav("المنتجات")} className="mt-6 flex items-center gap-2 text-xs font-bold text-[#F1D6A8]">مراجعة المنتجات <ArrowRight className="h-4 w-4" /></button></div></div>
            <div className="mt-6 rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5 lg:p-6"><div className="flex items-center justify-between"><div><h3 className="font-black">آخر الطلبات</h3><p className="mt-1 text-xs text-[#7A867E]">تابع طلبات عملائك الأخيرة من مكان واحد.</p></div><button onClick={() => setActiveNav("الطلبات")} className="flex items-center gap-1 text-xs font-bold text-[#4B8061]">عرض كل الطلبات <ChevronLeft className="h-4 w-4" /></button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-right"><thead><tr className="border-b border-[#E8EDE8] text-[10px] font-bold text-[#9AA49D]"><th className="pb-3 font-bold">رقم الطلب</th><th className="pb-3 font-bold">العميل</th><th className="pb-3 font-bold">المحتويات</th><th className="pb-3 font-bold">الإجمالي</th><th className="pb-3 font-bold">الحالة</th><th className="pb-3 font-bold">التاريخ</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b border-[#F0F2EE] last:border-0"><td className="py-4 text-xs font-bold text-[#4B8061]">{order.id}</td><td className="py-4 text-xs font-bold">{order.customer}</td><td className="py-4 text-xs text-[#7A867E]">{order.items}</td><td className="py-4 text-xs font-black">{order.total}</td><td className="py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${order.color === "new" ? "bg-[#F8EBCF] text-[#A47638]" : order.color === "progress" ? "bg-[#E6EEF7] text-[#52749B]" : order.color === "shipped" ? "bg-[#E0F0E4] text-[#4B8962]" : "bg-[#EEF0EE] text-[#7A867E]"}`}>{order.status}</span></td><td className="py-4 text-[10px] text-[#A1ABA4]">{order.date}</td></tr>)}</tbody></table></div></div>
            <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="flex items-center gap-4 rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF5EF] text-[#4B8061]"><MessageCircle className="h-5 w-5" /></div><div><p className="text-xs font-bold">مساعد نُقطة</p><p className="mt-1 text-[11px] text-[#7A867E]">٤ محادثات بانتظار الرد</p></div><ChevronLeft className="mr-auto h-4 w-4 text-[#A1ABA4]" /></div><div className="flex items-center gap-4 rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8EBCF] text-[#B47E44]"><Clock3 className="h-5 w-5" /></div><div><p className="text-xs font-bold">زمن تجهيز الطلب</p><p className="mt-1 text-[11px] text-[#7A867E]">أسرع بـ ١٨٪ من الشهر الماضي</p></div></div><div className="flex items-center gap-4 rounded-2xl border border-[#E4EAE4] bg-[#FBFCFA] p-5"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6EEF7] text-[#52749B]"><CircleHelp className="h-5 w-5" /></div><div><p className="text-xs font-bold">مركز المساعدة</p><p className="mt-1 text-[11px] text-[#7A867E]">نحن هنا لمساعدتك دائمًا</p></div></div></div>
          </>}
        </main>
      </div>
      {showAddProduct && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#183D34]/35 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-[#FBFCFA] p-6 shadow-2xl" dir="rtl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold tracking-widest text-[#A47638]">منتج جديد</p><h2 className="mt-1 text-2xl font-black">أضف إلى متجرك</h2></div><button onClick={() => setShowAddProduct(false)} className="rounded-full bg-[#F0F3EF] p-2"><X className="h-4 w-4" /></button></div><div className="mt-6 space-y-4"><label className="block text-xs font-bold">اسم المنتج<input className="mt-2 h-11 w-full rounded-xl border border-[#DFE7E0] bg-white px-3 text-sm outline-none focus:border-[#4B8061]" placeholder="مثال: قميص كتان" /></label><label className="block text-xs font-bold">القسم<select className="mt-2 h-11 w-full rounded-xl border border-[#DFE7E0] bg-white px-3 text-sm outline-none focus:border-[#4B8061]"><option>ملابس نسائي</option><option>ملابس رجالي</option><option>أواني ومنزل</option><option>تحف فنية</option></select></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-bold">السعر<input className="mt-2 h-11 w-full rounded-xl border border-[#DFE7E0] bg-white px-3 text-sm outline-none" placeholder="٠ د.ع" /></label><label className="block text-xs font-bold">المخزون<input className="mt-2 h-11 w-full rounded-xl border border-[#DFE7E0] bg-white px-3 text-sm outline-none" placeholder="٠" /></label></div></div><Button onClick={() => setShowAddProduct(false)} className="mt-7 h-11 w-full rounded-full bg-[#173F35] font-bold hover:bg-[#245B4B]"><Check className="h-4 w-4" /> حفظ المنتج</Button><p className="mt-3 text-center text-[10px] text-[#9AA49D]">هذه معاينة لواجهة الإضافة، وسيتم ربط الحفظ بقاعدة البيانات في المرحلة التالية.</p></div></div>}
    </div>
  );
}
