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
      <div className="animate-bounce">
        <Car className="w-16 h-16 text-black animate-pulse" />
      </div>
      <div className="text-xl text-black mt-4">
        Por favor, espere{dots}
      </div>
    </div>
  );
}
