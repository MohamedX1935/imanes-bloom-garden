
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DrawingProps {
  onSave: (imageData: string) => void;
  className?: string;
}

const Drawing: React.FC<DrawingProps> = ({ onSave, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 3;
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      
      // Get coordinates for both touch and mouse events
      let x, y;
      if ('touches' in e) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        }
      } else {
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      if (x !== undefined && y !== undefined) {
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Get coordinates for both touch and mouse events
    let x, y;
    if ('touches' in e) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      }
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    if (x !== undefined && y !== undefined) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      onSave(imageData);
    }
  };

  const colors = ['#000000', '#9b87f5', '#9FD0AE', '#F8C4A9', '#FF6B6B'];

  return (
    <Card className={`bloom-card ${className || ''}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-handwriting text-bloom-purple-dark">Espace Créatif</h3>
        <p className="text-sm text-gray-500">Dessine ce qui te passe par la tête</p>
      </div>
      
      <div className="flex justify-center space-x-2 mb-3">
        {colors.map((c) => (
          <button
            key={c}
            className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      
      <div className="border rounded-lg border-bloom-green-light bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          onClick={clearCanvas}
          variant="outline"
          className="border-bloom-purple-light text-bloom-purple hover:bg-bloom-purple-light/20"
        >
          Effacer
        </Button>
        <Button 
          onClick={saveDrawing}
          className="bloom-button"
        >
          Sauvegarder
        </Button>
      </div>
    </Card>
  );
};

export default Drawing;
