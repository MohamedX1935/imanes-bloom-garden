
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Flower, CloudSun, Sparkles, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Sticker {
  id: string;
  type: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface CreativeWorkshopProps {
  onSave?: (imageData: string) => void;
}

const CreativeWorkshop: React.FC<CreativeWorkshopProps> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#9b87f5'); // Violet Bloom par défaut
  const [brushSize, setBrushSize] = useState(3);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<string[]>([]);

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        setCtx(context);

        // Fond blanc
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Charger les dessins sauvegardés
    const savedDrawings = localStorage.getItem('creativeDrawings');
    if (savedDrawings) {
      setDrawings(JSON.parse(savedDrawings));
    }
  }, []);

  // Fonctions pour le dessin
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    
    // Obtenir les coordonnées pour les événements tactiles et souris
    let x, y;
    if ('touches' in e) {
      const rect = canvasRef.current!.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Obtenir les coordonnées pour les événements tactiles et souris
    let x, y;
    if ('touches' in e) {
      const rect = canvasRef.current!.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  // Ajouter un sticker
  const addSticker = (type: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}-${Math.random()}`,
      type,
      x: centerX,
      y: centerY,
      size: 40,
      rotation: Math.random() * 20 - 10, // rotation aléatoire entre -10 et 10 degrés
    };
    
    setStickers([...stickers, newSticker]);
    setActiveSticker(newSticker.id);
    renderCanvas();
  };

  // Rendu du canvas avec les stickers
  const renderCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    // Redessiner le canvas (à implémenter pour préserver le dessin)
    stickers.forEach(sticker => {
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate(sticker.rotation * Math.PI / 180);
      
      switch (sticker.type) {
        case 'heart':
          drawHeart(ctx, 0, 0, sticker.size, color);
          break;
        case 'star':
          drawStar(ctx, 0, 0, 5, sticker.size/2, sticker.size/4, color);
          break;
        case 'flower':
          drawFlower(ctx, 0, 0, sticker.size, color);
          break;
        // Ajouter d'autres types de stickers au besoin
      }
      
      ctx.restore();
    });
  };

  // Fonctions de dessin de stickers
  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(
      x, y, 
      x - size/2, y, 
      x - size/2, y + size/4
    );
    ctx.bezierCurveTo(
      x - size/2, y + size/2, 
      x, y + size*3/4, 
      x, y + size
    );
    ctx.bezierCurveTo(
      x, y + size*3/4, 
      x + size/2, y + size/2, 
      x + size/2, y + size/4
    );
    ctx.bezierCurveTo(
      x + size/2, y, 
      x, y, 
      x, y + size/4
    );
    ctx.closePath();
    ctx.fill();
  };
  
  const drawStar = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    points: number, 
    outerRadius: number, 
    innerRadius: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / points;
      ctx.lineTo(x + radius * Math.sin(angle), y - radius * Math.cos(angle));
    }
    ctx.closePath();
    ctx.fill();
  };
  
  const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    const petalCount = 5;
    const petalSize = size / 2;
    
    ctx.fillStyle = color;
    
    // Dessiner les pétales
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount;
      const dx = Math.cos(angle) * petalSize;
      const dy = Math.sin(angle) * petalSize;
      
      ctx.beginPath();
      ctx.ellipse(x + dx/2, y + dy/2, petalSize/2, petalSize/2, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Dessiner le centre
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(x, y, size/6, 0, Math.PI * 2);
    ctx.fill();
  };

  // Effacer le canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStickers([]);
  };

  // Sauvegarder le dessin
  const saveDrawing = () => {
    if (!canvasRef.current) return;
    
    // Rendu final avec tous les stickers
    renderCanvas();
    
    const imageData = canvasRef.current.toDataURL('image/png');
    
    // Ajouter à la liste des dessins
    const newDrawings = [imageData, ...drawings];
    setDrawings(newDrawings);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('creativeDrawings', JSON.stringify(newDrawings));
    
    // Callback si fourni
    if (onSave) onSave(imageData);
    
    toast.success("Création sauvegardée dans ta galerie!");
  };

  const colors = [
    '#9b87f5', // Bloom Purple
    '#9FD0AE', // Bloom Green
    '#F8C4A9', // Peach
    '#FFB6C1', // Pink
    '#87CEEB', // Sky Blue
    '#FFFFE0', // Light Yellow
  ];

  return (
    <Card className="bloom-card p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-handwriting text-bloom-purple-dark">Atelier Créatif</h3>
        <p className="text-sm text-gray-500">Exprime ta créativité</p>
      </div>
      
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          {[2, 5, 8].map((size) => (
            <button
              key={size}
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${brushSize === size ? 'bg-gray-200 border-gray-400' : 'border-gray-300'}`}
              onClick={() => setBrushSize(size)}
            >
              <div 
                className="rounded-full bg-current" 
                style={{ width: size, height: size }} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center space-x-3 mb-4">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => addSticker('heart')}
          className="flex items-center gap-1"
        >
          <Heart size={16} className="text-pink-500" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => addSticker('star')}
          className="flex items-center gap-1"
        >
          <Star size={16} className="text-yellow-500" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => addSticker('flower')}
          className="flex items-center gap-1"
        >
          <Flower size={16} className="text-bloom-purple" />
        </Button>
      </div>
      
      <div className="border rounded-lg border-bloom-green-light bg-white overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
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
      
      <div className="flex justify-between">
        <Button 
          onClick={clearCanvas}
          variant="outline"
          className="border-bloom-purple-light text-bloom-purple hover:bg-bloom-purple-light/20"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Effacer
        </Button>
        <Button 
          onClick={saveDrawing}
          className="bloom-button"
        >
          <Save className="w-4 h-4 mr-1" /> Sauvegarder
        </Button>
      </div>
    </Card>
  );
};

export default CreativeWorkshop;
