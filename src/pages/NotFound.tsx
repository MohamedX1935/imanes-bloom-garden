
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="text-5xl mb-6">🌱</div>
        <h1 className="text-3xl font-handwriting text-bloom-purple mb-4">Oops!</h1>
        <p className="text-gray-600 mb-6">
          Cette page n'existe pas dans ton jardin
        </p>
        <Button className="bloom-button" onClick={() => window.location.href = '/garden'}>
          Retourner au jardin
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
