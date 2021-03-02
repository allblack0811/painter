import React, { useRef, useState, useCallback, useEffect } from "react";
import "./style/style.scss";


interface Coordinate {
  x: number;
  y: number;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);

  const [color, setcolor] = useState<string>("red");
  const [width, setwidth] = useState(1);
  const getCoordinates = (event: MouseEvent) => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  };
  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      
      context.strokeStyle = color;
      context.lineJoin = 'round';
      context.lineWidth = width;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };
  const startPaint = useCallback((event: MouseEvent) => {
    
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const Paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("isPainting",isPainting);
      if (isPainting) {
      
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
  }, [isPainting,mousePosition]);
  
  const exitPaint = useCallback(() => {
    // alert("stop");
    setIsPainting(false);
  }, []);

  
  

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', Paint);
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);

    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', Paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [startPaint, Paint, exitPaint]);
  console.log(color==="red" ? "now" : "");

  return (
    <>
    <div id="canvers">
      <canvas  ref={canvasRef} height="600px" width="1500px"/>
    </div>
      <div id="tools">
        <ul>
          <li>
            <div
              className={color==="red" ?"color_box red now" : "color_box red"}
              onClick={() => setcolor("red")}
            />
          </li>
          <li>
            <div
              className={color==="green" ?"color_box green now" : "color_box green"}
              onClick={() => setcolor("green")}
            />
          </li>
          <li>
            <div className={color==="blue" ?"color_box blue now" : "color_box blue"} onClick={() => setcolor("blue")} />
          </li>
          <li>
            <div
              className={color==="yellow" ?"color_box yellow now" : "color_box yellow"}
              onClick={() => setcolor("yellow")}
            />
          </li>
          <li>
            <div
              className={color==="orange" ?"color_box orange now" : "color_box orange"}
              onClick={() => setcolor("orange")}
            />
          </li>
        </ul>
        <input type="range" min="1" max="50" step="1" value={""+width} onChange={e=>{
          setwidth(parseInt(e.target.value))
          }}/>
      </div>
    </>
  );
}

export default App;
