import { Car } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingComponent() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-4xl font-bold text-black mb-4">Cargando</div>
      <div className="relative">
        <div className="animate-bounce">
          <Car className="w-16 h-16 text-black animate-pulse" />
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className="w-16 h-1 bg-gray-200 rounded-full">
            <div className="w-4 h-1 bg-black rounded-full animate-[carMove_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
      <div className="text-xl text-black mt-4">
        Por favor, espere{dots}
      </div>
    </div>
  );
}
