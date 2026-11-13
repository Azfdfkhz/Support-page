import Image from "next/image";
import Link from "next/link";
import Shell from "@/components/onboarding/Shell";
import { REGISTER_PATH } from "@/constants/routes";

export const metadata = { title: "Buat Support Page untuk dirimu" };

const benefits = [
  { icon: "/Gift.png", title: "Terima dukungan lebih mudah", text: "Bagikan satu halaman untuk menerima support kapan saja." },
  { icon: "/Profil-love.png", title: "Tampilkan dirimu", text: "Perkenalkan dirimu lewat foto, cerita, dan aktivitasmu." },
  { icon: "/Share.png", title: "Mudah dibagikan", text: "Bagikan link support page ke audiensmu." },
];

const steps = ["Daftar", "Bagikan", "Terima support"];

export default function IntroPage() {
  return (
    <Shell>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <div className="relative aspect-[364/223] w-full overflow-hidden rounded-3xl bg-brand-soft">
          <Image src="/Waving-support-guide.png" alt="" fill priority sizes="414px" className="object-cover" />
        </div>

        <h1 className="mt-5 text-[22px] font-bold leading-tight text-ink">Buat Support Page untuk dirimu</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">Satu halaman untuk menerima dukungan dari siapa saja.</p>

        <ul className="mt-4 space-y-3.5">
          {benefits.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft">
                <Image src={item.icon} alt="" width={20} height={20} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">{item.title}</h2>
                <p className="text-xs leading-snug text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <hr className="mt-6 border-brand-soft" />

        <section aria-labelledby="how-title" className="mt-5">
          <h2 id="how-title" className="text-base font-semibold text-ink">Cara kerja</h2>
          <ol className="mt-3 grid grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className="flex flex-col items-center gap-1.5 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#E5F5FF] text-[15px] font-semibold leading-none text-[#1A73EB]">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <Link
          href={REGISTER_PATH}
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-xl bg-brand text-base font-semibold text-white shadow-[0_6px_14px_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark"
        >
          Daftar
        </Link>
      </div>
    </Shell>
  );
}
