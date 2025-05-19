
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eraser, Save, Download } from 'lucide-react';

interface DrawingProps {
  onSave: (imageData: string) => void;
}

const Drawing: React.FC<DrawingProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState('#6d28d9'); // Purple default
  const [brushSize, setBrushSize] = useState(5);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = color;
        setContext(ctx);
      }
      
      // Set canvas dimensions
      resizeCanvas();
      
      // Handle window resize
      window.addEventListener('resize', resizeCanvas);
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, []);
  
  // Update context when color or brush size changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    }
  }, [color, brushSize, context]);
  
  const resizeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Get the parent element's width
      const container = canvas.parentElement;
      if (container) {
        const width = container.clientWidth - 20; // Minus some padding
        canvas.width = width;
        canvas.height = width * 0.75; // 4:3 aspect ratio
        
        // Redraw after resize if context exists
        if (context) {
          context.lineJoin = 'round';
          context.lineCap = 'round';
          context.lineWidth = brushSize;
          context.strokeStyle = color;
        }
      }
    }
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    
    if (context && canvasRef.current) {
      const canvas = canvasRef.current;
      let x, y;
      
      if ('touches' in e) {
        // Touch event
        const rect = canvas.getBoundingClientRect();
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        // Mouse event
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
      }
      
      context.beginPath();
      context.moveTo(x, y);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      e.preventDefault(); // Prevent scrolling when drawing
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    context.lineTo(x, y);
    context.stroke();
  };
  
  const endDrawing = () => {
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };
  
  const saveDrawing = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      onSave(imageData);
      clearCanvas();
    }
  };
  
  const downloadDrawing = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `dessin-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = imageData;
      link.click();
    }
  };
  
  const colors = [
    '#6d28d9', // Purple
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#000000', // Black
  ];
  
  return (
    <Card className="bloom-card p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex space-x-2">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full ${
                color === c ? 'ring-2 ring-offset-2 ring-bloom-purple' : ''
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="text-sm border rounded p-1"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          >
            <option value="2">Fin</option>
            <option value="5">Moyen</option>
            <option value="10">Épais</option>
            <option value="15">Très épais</option>
          </select>
        </div>
      </div>
      
      <div className="relative border rounded-lg overflow-hidden mb-3">
        <canvas
          ref={canvasRef}
          className="touch-none bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearCanvas} 
          className="flex items-center"
        >
          <Eraser className="w-4 h-4 mr-1" />
          Effacer
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadDrawing}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
          
          <Button 
            size="sm" 
            onClick={saveDrawing}
            className="bloom-button flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Drawing;
