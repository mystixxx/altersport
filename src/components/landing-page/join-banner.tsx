import { ArrowRight } from "lucide-react";

export default function JoinBanner() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[url('/connect.svg')] bg-cover bg-center px-5 py-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-bold text-white">Pridruži nam se!</h2>
        <p className="text-base font-medium text-white">
          Prijavi se putem obrasca i započni svoje sportsko putovanje s nama. Za
          tebe imamo besplatni probni trening.
        </p>
      </div>
      <button className="bg-cta hover:bg-cta/80 flex w-fit cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300">
        Prijavi se
        <ArrowRight size={16} color="white" />
      </button>
    </div>
  );
}
