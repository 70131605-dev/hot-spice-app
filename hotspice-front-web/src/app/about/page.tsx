import { Flame, Bike, Tag, Phone, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-10">
      <div className="text-center">
        <p className="text-3xl font-extrabold text-brand">🍔 Hot &amp; Spice</p>
        <p className="mt-2 font-semibold text-[#666]">
          It&apos;s finger lickin&apos; fast.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className="mb-2 text-lg font-extrabold text-[#1a1a1a]">
          Who We Are
        </h2>
        <p className="leading-relaxed text-[#555]">
          Hot &amp; Spice is a Lahore-born fast-food brand serving up bold,
          flavour-packed burgers, crispy chicken, hearty combos and
          refreshing beverages. Since day one, we&apos;ve been obsessed with
          getting great food to our customers as fast as possible, without
          ever cutting corners on taste or quality.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className="mb-3 text-lg font-extrabold text-[#1a1a1a]">
          Our Promise
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint">
              <Flame size={18} className="text-brand" />
            </span>
            <span className="font-semibold text-[#555]">
              Freshly prepared, every single order
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint">
              <Bike size={18} className="text-brand" />
            </span>
            <span className="font-semibold text-[#555]">
              Fast delivery across the city
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint">
              <Tag size={18} className="text-brand" />
            </span>
            <span className="font-semibold text-[#555]">
              Honest pricing, no surprises
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className="mb-3 text-lg font-extrabold text-[#1a1a1a]">
          Get in Touch
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-brand" />
            <span className="font-semibold text-[#555]">042-111-000-111</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-brand" />
            <span className="font-semibold text-[#555]">
              support@hotandspice.pk
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-brand" />
            <span className="font-semibold text-[#555]">
              Lahore, Pakistan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
