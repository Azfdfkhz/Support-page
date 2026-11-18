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
      <div className="flex flex-1 flex-col px-6.5 pb-8 pt-5.25">
        <div className="relative aspect-364/223 w-full overflow-hidden rounded-[1.75rem] bg-brand-soft">
          <Image src="/Waving-support-guide.svg" alt="" fill priority unoptimized sizes="414px" className="object-cover" />
        </div>

        <h1 className="mt-6 text-[3rem] font-bold leading-normal text-ink">Buat Support Page untuk dirimu</h1>
        <p className="mt-3 text-[1.0625rem] leading-[1.55] text-muted">Satu halaman untuk menerima dukungan dari siapa saja.</p>

        <ul className="mt-5 space-y-4">
          {benefits.map((item) => (
            <li key={item.title} className="flex items-center gap-4">
              <span className="grid size-11.5 shrink-0 place-items-center rounded-2xl bg-brand-soft">
                <Image src={item.icon} alt="" width={24} height={24} className="size-6" />
              </span>
              <div>
                <h2 className="text-[1.0625rem] font-semibold text-ink">{item.title}</h2>
                <p className="text-[0.9375rem] leading-normal text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <hr className="mt-7 border-brand-soft" />

        <section aria-labelledby="how-title" className="mt-6">
          <h2 id="how-title" className="text-2xl font-semibold text-ink">Cara kerja</h2>
          <ol className="mt-4 flex items-start justify-between px-2">
            {steps.map((step, index) => (
              <li key={step} className="flex flex-col items-center gap-2">
                <span className="grid size-11.5 place-items-center rounded-full bg-brand-soft text-lg font-semibold text-accent">
                  {index + 1}
                </span>
                <span className="text-[0.9375rem] font-medium text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <Link
          href={REGISTER_PATH}
          className="mt-auto flex h-14 w-full items-center justify-center rounded-2xl bg-brand text-xl font-semibold text-white shadow-[0_0.375rem_0.875rem_rgba(46,104,178,0.3)] transition-colors hover:bg-brand-dark"
        >
          Daftar
        </Link>
      </div>
    </Shell>
  );
}
