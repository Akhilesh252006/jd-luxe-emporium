import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-yellow-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-yellow-500 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
          The treasure you seek seems to have vanished. Let us guide you back to our curated collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">


          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-gray-900 font-medium border-2 border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-mono">
            Requested path: <span className="text-yellow-600">{location.pathname}</span>
          </p>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;