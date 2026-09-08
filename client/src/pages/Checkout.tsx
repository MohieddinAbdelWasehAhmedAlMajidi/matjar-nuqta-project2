import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, MapPin, PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

const formatCurrency = (value: number) => new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD", maximumFractionDigits: 0 }).format(value);

type CheckoutProduct = { id: number; name: string; price: number; image?: string };

const fallbackItems: CheckoutProduct[] = [
  { id: 1, name: "طقم كتان صيفي", price: 34900, image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=300&q=80" },
  { id: 5, name: "طقم أواني خزفي", price: 63900, image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=300&q=80" },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "بغداد", address: "", notes: "" });
  const createOrder = trpc.orders.create.useMutation({ onSuccess: () => setSubmitted(true) });
  const items = useMemo(() => {
    try {
      const stored = localStorage.getItem("nuqta-cart");
      return stored ? (JSON.parse(stored) as CheckoutProduct[]) : fallbackItems;
    } catch {
      return fallbackItems;
    }
  }, []);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    createOrder.mutate({
      customerName: form.name,
      phone: form.phone,
      city: form.city,
      address: form.address,
      notes: form.notes || undefined,
      items: items.map((item) => ({ productId: item.id, quantity: 1 })),
    });
  };

  if (submitted) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FBF9F5] px-5 text-center" dir="rtl"><div className="max-w-md"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F1E7] text-[#4B8962]"><Check className="h-9 w-9" /></div><p className="mt-7 text-[11px] font-bold tracking-widest text-[#B47E44]">تم استلام طلبك</p><h1 className="mt-3 font-display text-4xl font-bold text-[#173F35]">وصلت النُقطة.</h1><p className="mt-4 text-sm leading-7 text-[#6C7970]">شكرًا لثقتك. سيتواصل معك فريقنا لتأكيد الطلب وتفاصيل التوصيل.</p><Button onClick={() => setLocation("/")} className="mt-8 rounded-full bg-[#173F35] px-7 font-bold hover:bg-[#245B4B]">العودة للمتجر <ArrowRight className="h-4 w-4" /></Button></div></div>;
  }

  return <div className="min-h-screen bg-[#FBF9F5] text-[#173F35]" dir="rtl"><header className="border-b border-[#EDE8DF] bg-[#FBF9F5]"><div className="container flex h-[76px] items-center justify-between"><button onClick={() => setLocation("/")} className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F35] text-xl font-black text-white">ن</div><span className="font-display text-xl font-bold">نُقطة</span></button><div className="flex items-center gap-2 text-xs font-bold text-[#748078]"><ShieldCheck className="h-4 w-4 text-[#4B8962]" /> طلب آمن ومشفر</div></div></header><main className="container py-10 lg:py-16"><div className="mb-10"><p className="text-[11px] font-bold tracking-widest text-[#B47E44]">خطوة أخيرة</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight">أكمل طلبك</h1><p className="mt-2 text-sm text-[#748078]">أخبرنا أين نرسل اختياراتك من نُقطة.</p></div><div className="grid gap-8 lg:grid-cols-[1fr_390px]"><form onSubmit={submit} className="rounded-3xl border border-[#E4EAE4] bg-white p-6 lg:p-8"><div className="flex items-center gap-3 border-b border-[#EEF1ED] pb-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF5EF] text-[#4B8962]"><MapPin className="h-5 w-5" /></div><div><h2 className="font-bold">بيانات التوصيل</h2><p className="mt-1 text-xs text-[#849087]">نستخدمها لتأكيد وشحن طلبك فقط.</p></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold">الاسم الكامل<Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 h-11 rounded-xl border-[#DDE5DE]" placeholder="مثال: سارة محمد" /></label><label className="text-xs font-bold">رقم الهاتف<Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-2 h-11 rounded-xl border-[#DDE5DE]" placeholder="07xxxxxxxxx" /></label><label className="text-xs font-bold">المدينة<select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-[#DDE5DE] bg-white px-3 text-sm outline-none"><option>بغداد</option><option>البصرة</option><option>أربيل</option><option>الموصل</option><option>النجف</option></select></label><label className="text-xs font-bold">العنوان بالتفصيل<Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-2 h-11 rounded-xl border-[#DDE5DE]" placeholder="الحي، الشارع، أقرب نقطة دالة" /></label><label className="text-xs font-bold sm:col-span-2">ملاحظات للطلب (اختياري)<Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-2 h-11 rounded-xl border-[#DDE5DE]" placeholder="وقت مناسب للتوصيل أو أي ملاحظة أخرى" /></label></div><div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#F5F8F4] p-4 text-xs leading-6 text-[#63736A]"><PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4B8962]" /> الدفع عند الاستلام متاح حاليًا. سيؤكد فريق نُقطة التفاصيل معك قبل الشحن.</div><Button disabled={createOrder.isPending} type="submit" className="mt-7 h-12 w-full rounded-full bg-[#173F35] font-bold hover:bg-[#245B4B]">{createOrder.isPending ? "جارٍ التأكيد..." : "تأكيد الطلب"} <ArrowRight className="h-4 w-4" /></Button></form><aside className="h-fit rounded-3xl bg-[#173F35] p-6 text-[#F8F2E8] lg:p-7"><div className="flex items-center gap-3 border-b border-white/10 pb-5"><ShoppingBag className="h-5 w-5 text-[#E8AF56]" /><div><h2 className="font-bold">ملخص الطلب</h2><p className="mt-1 text-xs text-[#B7C9BF]">{items.length} منتجات مختارة</p></div></div><div className="space-y-4 py-6">{items.map((item, index) => <div key={`${item.id}-${index}`} className="flex items-center gap-3"><img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{item.name}</p><p className="mt-1 text-[10px] text-[#B7C9BF]">الكمية: ١</p></div><p className="text-xs font-bold text-[#F1D6A8]">{formatCurrency(item.price)}</p></div>)}</div><div className="space-y-3 border-t border-white/10 pt-5 text-xs"><div className="flex justify-between text-[#B7C9BF]"><span>المجموع الفرعي</span><span>{formatCurrency(total)}</span></div><div className="flex justify-between text-[#B7C9BF]"><span>التوصيل</span><span className="text-[#9BCEA9]">مجاني</span></div><div className="mt-3 flex justify-between border-t border-white/10 pt-4 text-base font-black"><span>الإجمالي</span><span>{formatCurrency(total)}</span></div></div></aside></div></main></div>;
}
