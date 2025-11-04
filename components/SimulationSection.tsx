import React, { useState, useEffect, useRef, useCallback } from 'react';

type SimulationType = 'pendulum' | 'freefall' | 'friction' | null;

// --- Freefall Simulation Component ---
const FreefallSimulation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // FIX: Initialize useRef with null to provide an initial value and satisfy the hook's argument expectation.
    const animationFrameId = useRef<number | null>(null);
    const ball = useRef({ y: 20, vy: 0, radius: 15 });
    const gravity = 0.2; // Adjusted for smooth animation
    const bounceFactor = -0.7;

    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the ground
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Draw the ball
        ctx.beginPath();
        ctx.arc(canvas.width / 2, ball.current.y, ball.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e53e3e';
        ctx.fill();
        ctx.closePath();
    }, []);
    
    const update = useCallback((canvas: HTMLCanvasElement) => {
        // Apply gravity
        ball.current.vy += gravity;
        ball.current.y += ball.current.vy;

        // Bounce off the ground
        if (ball.current.y + ball.current.radius > canvas.height - 20) {
            ball.current.y = canvas.height - 20 - ball.current.radius;
            ball.current.vy *= bounceFactor;
            // Add a condition to stop bouncing
            if (Math.abs(ball.current.vy) < 1) {
                ball.current.vy = 0;
            }
        }
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        update(canvas);
        draw(ctx, canvas);
        
        animationFrameId.current = requestAnimationFrame(animate);
    }, [draw, update]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animate]);

    const resetSimulation = () => {
        ball.current = { y: 20, vy: 0, radius: 15 };
    };

    const pixelsPerMeter = 10; // Simple scale
    const realTime = (Math.sqrt(2 * (ball.current.y / pixelsPerMeter) / 9.8)).toFixed(2);
    const realVelocity = (9.8 * parseFloat(realTime)).toFixed(2);
    const realHeight = ((300 - 20) / pixelsPerMeter).toFixed(1);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-blue-600">Mô Phỏng Rơi Tự Do</h3>
            <div className="grid md:grid-cols-3 gap-2 text-sm mb-4">
                <div className="bg-blue-50 p-2 rounded"><strong>Gia tốc:</strong> a = g ≈ 9.8 m/s²</div>
                <div className="bg-green-50 p-2 rounded"><strong>Quãng đường:</strong> s = ½gt²</div>
                <div className="bg-yellow-50 p-2 rounded"><strong>Vận tốc:</strong> v = gt</div>
            </div>
            <canvas ref={canvasRef} width="400" height="300" className="bg-blue-50 rounded-lg border-2 border-blue-200 mx-auto"></canvas>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded"><strong>Thời gian:</strong> {realTime} s</div>
                <div className="bg-gray-100 p-2 rounded"><strong>Vận tốc:</strong> {realVelocity} m/s</div>
                <div className="bg-gray-100 p-2 rounded"><strong>Độ cao:</strong> {realHeight} m</div>
            </div>
             <button onClick={resetSimulation} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Làm Lại</button>
        </div>
    );
};


// --- Friction Simulation Component ---
const FrictionSimulation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [angle, setAngle] = useState(20); // degrees
    const [frictionCoeff, setFrictionCoeff] = useState(0.3);
    // FIX: Initialize useRef with null to provide an initial value and satisfy the hook's argument expectation.
    const animationFrameId = useRef<number | null>(null);
    const block = useRef({ s: 20, v_slope: 0, width: 30, height: 20 }); // s is position along slope

    const g = 9.8;
    
    const resetSimulationState = useCallback(() => {
        block.current = { s: 20, v_slope: 0, width: 30, height: 20 };
    }, []);

    // This useEffect resets the simulation whenever the parameters change.
    useEffect(() => {
        resetSimulationState();
    }, [angle, frictionCoeff, resetSimulationState]);


    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Physics Update
        const angleRad = angle * Math.PI / 180;
        const forceParallel = g * Math.sin(angleRad);
        const normalForce = g * Math.cos(angleRad);
        const frictionForce = frictionCoeff * normalForce;

        let a_slope = 0;
        if (forceParallel > frictionForce) {
            a_slope = forceParallel - frictionForce;
        }

        block.current.v_slope += a_slope * 0.1;
        block.current.s += block.current.v_slope * 0.1;

        const blockX_check = block.current.s * Math.cos(angleRad);
        if (blockX_check >= canvas.width - block.current.width) {
             block.current.v_slope = 0;
        }

        // Drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw inclined plane (left side high, right side low)
        ctx.save();
        ctx.translate(0, 50); // Move origin to top-left
        ctx.rotate(angleRad); // Counter-clockwise rotation slopes it down
        ctx.fillStyle = '#a0aec0';
        ctx.fillRect(0, 0, canvas.width / Math.cos(angleRad), 50);
        ctx.restore();

        const blockX = block.current.s * Math.cos(angleRad);
        const blockY = 50 + block.current.s * Math.sin(angleRad);

        ctx.save();
        ctx.translate(blockX, blockY);
        ctx.rotate(angleRad);
        ctx.fillStyle = '#4299e1';
        ctx.fillRect(0, -block.current.height, block.current.width, block.current.height);
        ctx.restore();

        animationFrameId.current = requestAnimationFrame(animate);
    }, [angle, frictionCoeff]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [animate]);


    const angleRad = angle * Math.PI / 180;
    const forceParallel = g * Math.sin(angleRad);
    const normalForce = g * Math.cos(angleRad);
    const frictionForceVal = frictionCoeff * normalForce;
    const accelerationVal = forceParallel > frictionForceVal ? forceParallel - frictionForceVal : 0;

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-red-600">Mô Phỏng Lực Ma Sát</h3>
            <canvas ref={canvasRef} width="400" height="250" className="bg-gray-50 rounded-lg border-2 border-red-200 mx-auto"></canvas>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Góc nghiêng: {angle}°</label>
                    <input type="range" min="0" max="45" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Hệ số ma sát: {frictionCoeff.toFixed(2)}</label>
                    <input type="range" min="0.1" max="1.0" step="0.05" value={frictionCoeff} onChange={e => setFrictionCoeff(Number(e.target.value))} className="w-full" />
                </div>
            </div>
             <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 p-2 rounded"><strong>Vận tốc:</strong> {block.current.v_slope.toFixed(2)} m/s</div>
                <div className="bg-gray-100 p-2 rounded"><strong>Gia tốc:</strong> {accelerationVal.toFixed(2)} m/s²</div>
            </div>
            <button onClick={resetSimulationState} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Làm Lại</button>
        </div>
    );
};

// --- Pendulum Simulation Component ---
const PendulumSimulation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // FIX: Initialize useRef with null to provide an initial value and satisfy the hook's argument expectation.
    const animationFrameId = useRef<number | null>(null);
    const pendulum = useRef({ angle: Math.PI / 4, aVelocity: 0, length: 120 });
    
    const gravity = 0.1;

    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const { angle, length } = pendulum.current;
        const pivotX = canvas.width / 2;
        const pivotY = 20;
        const bobX = pivotX + length * Math.sin(angle);
        const bobY = pivotY + length * Math.cos(angle);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // String
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Pivot
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#2d3748';
        ctx.fill();

        // Bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#9f7aea';
        ctx.fill();
    }, []);

    const update = useCallback(() => {
        const { angle } = pendulum.current;
        const aAcceleration = (-1 * gravity / pendulum.current.length) * Math.sin(angle);
        pendulum.current.aVelocity += aAcceleration;
        pendulum.current.angle += pendulum.current.aVelocity;
        
        // Damping
        pendulum.current.aVelocity *= 0.995;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        update();
        draw(ctx, canvas);
        animationFrameId.current = requestAnimationFrame(animate);
    }, [draw, update]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [animate]);

    const resetSimulation = () => {
        pendulum.current = { angle: Math.PI / 4, aVelocity: 0, length: 120 };
    };

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-purple-600">Mô Phỏng Con Lắc Đơn</h3>
            <div className="bg-purple-50 p-2 rounded text-sm mb-4"><strong>Chu kỳ:</strong> T = 2π√(l/g)</div>
            <canvas ref={canvasRef} width="400" height="250" className="bg-gray-50 rounded-lg border-2 border-purple-200 mx-auto"></canvas>
            <button onClick={resetSimulation} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Làm Lại</button>
        </div>
    );
};


// --- Main Section Component ---
const SimulationSection: React.FC = () => {
  const [activeSim, setActiveSim] = useState<SimulationType>(null);

  const renderSimulation = () => {
    switch (activeSim) {
      case 'freefall':
        return <FreefallSimulation />;
      case 'friction':
        return <FrictionSimulation />;
      case 'pendulum':
        return <PendulumSimulation />;
      default:
        return (
          <div className="text-center text-gray-500 h-64 flex flex-col justify-center items-center">
            <div className="text-5xl mb-4">🔬</div>
            <p className="text-lg">Chọn một thí nghiệm để bắt đầu mô phỏng</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🧪 Mô Phỏng Tương Tác</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => setActiveSim('pendulum')} className={`p-4 rounded-lg transition-colors border-2 ${activeSim === 'pendulum' ? 'bg-purple-100 border-purple-300' : 'bg-purple-50 hover:bg-purple-100 border-purple-200'}`}>
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-semibold">Con Lắc Đơn</h3>
        </button>
        <button onClick={() => setActiveSim('freefall')} className={`p-4 rounded-lg transition-colors border-2 ${activeSim === 'freefall' ? 'bg-blue-100 border-blue-300' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'}`}>
          <div className="text-3xl mb-2">⬇️</div>
          <h3 className="font-semibold">Rơi Tự Do</h3>
        </button>
        <button onClick={() => setActiveSim('friction')} className={`p-4 rounded-lg transition-colors border-2 ${activeSim === 'friction' ? 'bg-red-100 border-red-300' : 'bg-red-50 hover:bg-red-100 border-red-200'}`}>
          <div className="text-3xl mb-2">📐</div>
          <h3 className="font-semibold">Lực Ma Sát</h3>
        </button>
      </div>

      <div className="simulation-canvas rounded-lg p-4 min-h-[400px]">
        {renderSimulation()}
      </div>
    </div>
  );
};

export default SimulationSection;