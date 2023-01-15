// import type { NextPage } from 'next'
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image'
import planImage from '../public/example_plan.jpeg'

let uri = '../public/plans/SSW-DLG-RS1-06-DR-A-6804%20-%20SIXTH%20FLOOR%20FIRE%20STRATEGY.jpg'
// let encoded = encodeURIComponent(uri);
// import fullPlanImage from '../public/plans/SSW-DLG-RS1-06-DR-A-6804\s-\sSIXTH\sFLOOR\sFIRE\sSTRATEGY.pdf'
import fullPlanImage from '../public/plans/SSW-DLG-RS1-06-DR-A-6804-SIXTHFLOORFIRESTRATEGY.jpg'
// console.log(encoded)

// should lines be saved in local storage -> kept if refreshed?
// TODO: include type of element in totalLines i.e. polyline, rectangle, marker, arrow
// have different drawing logic for each
// TODO: allow markers to be placed - different tool
// LATER: make responsive
// LATER: allow adding plan, with scale etc
function Home() {
  
        // TODO: tool object: polyline, rectangle, point
        const tools = {
          poly: "Polyline",
          rect: "Rectangle",
          point: "Point"
        }
      // function DrawingApp() {
        const canvasRef = useRef(null);
        const contextRef = useRef(null);

        const [isDrawing, setIsDrawing] = useState(false);
        const [polylinePoints, setPolylinePoints] = useState([])
        const [rectPoints, setRectPoints] = useState([]);
        const [totalLines, setTotalLines] = useState([]);
        const [currentTool, setCurrentTool] = useState(tools.poly)

        const canvasOffSetX = useRef(null);
        const canvasOffSetY = useRef(null);
        const startX = useRef(null);
        const startY = useRef(null);
        const endX = useRef(null);
        const endY = useRef(null);  
        
        
      // const size = useWindowSize();

      
      // Hook
      // function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
      // }
        let dragCounter = 0

        function getCanvasContext() {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');

          return [canvas, context]
        }
        function clearCanvas() {
          const [canvas, context] = getCanvasContext()
          //  should be full canvas dimensions
          // below for clear only??
          context.clearRect(0, 0, canvas.width, canvas.height);
          return [canvas, context]
        } 

        function handleClear() {
          setPolylinePoints([])
          setRectPoints([])
          setTotalLines([])
          clearCanvas()
        }

        function handleUndo() {
          setTotalLines(prevPoints => prevPoints.slice(0, -1))
        }


        useEffect(() => {
          // console.log("useEffect triggerred")
          const [canvas, context] = clearCanvas() // should this be cleared each time??
          
          // function handleResize() {
            // Set window width/height to state
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
          // }
          // perhaps redraw all polylines etc eact time
          // console.log(totalLines)
          // change below to loop
          for (let i = 0; i < totalLines.length; i++ ){
            // console.log("loop", i)
            // draw(context, totalLines[i])
            console.log("totalLines @ useEffect: ", totalLines)
            let current = totalLines[i]
            // should be type
            if (currentTool == tools.rect) {
              // draw rectangle
              // TODO: clean up issue with rendering flashing - not issue with polyline
              markRectangle(...current)
            }
            // console.log("current: ", current)
            if (currentTool == tools.poly) {
              markPoly(current)
              // drawPastPoly(context, current)
            // } else if (rectPoints.length) {
            //   console.log("currentRct: ", rectPoints)
            //   // draw rect
            //   let [x1, y1, x2, y2] = rectPoints
            //   // let [x2, y2] = rectPoints[1]
            //   markRectangle(x1, x2, y1, y2)

            }
          }
          // does below work when screen resizes??
          contextRef.current = context
          const canvasOffSet = canvas.getBoundingClientRect();
          canvasOffSetY.current = canvasOffSet.top;
          canvasOffSetX.current = canvasOffSet.left;

          // totalLines.forEach((line) => draw(context, line))  
          // needs to run when isDrawing, mouseDown and dragging mouse 
        }, [totalLines, dragCounter])
      // },)

        function startDrawingRectangle(event) {
          // event.preventDefault()
          // event.stopPropagation()

          startX.current = event.clientX - canvasOffSetX.current;
          startY.current = event.clientY - canvasOffSetY.current;          
        }
        
        function startDrawing(event) {
          // const canvas = canvasRef.current;
          // const context = canvas.getContext('2d');
          console.log("rect startDrawing", rectPoints)
          // 
          // start drawing rectangle or shape
          if (isDrawing) return
          if (currentTool == tools.rect) {
            // TODO: Only update further line if moves more than distance
            startDrawingRectangle(event)
          }
          setIsDrawing(true);
          // function for creating new element
          // add elements to state

          // context.beginPath();
          // context.moveTo(event.clientX, event.clientY);

        }
      
        function stopDrawing(event) {
          // action end of rectangle once here
          // remove if not drawing and mouse moving
          // drawRectangle(event)
          // console.log("totalLines", totalLines)
          // console.log("rect", rectPoints)
          if (!isDrawing) return
          if (currentTool == tools.rect) {
            // should only add points on mouse up
            // should be width below???
            setRectPoints([startX.current, startY.current, endX.current, endY.current])
            setTotalLines(prev => [...prev, [startX.current, startY.current, endX.current, endY.current]])
            console.log("rect end drawing: ", startX.current, startY.current, endX.current, endY.current)
          }
          setIsDrawing(false);
        }
      
        function addPolylinePoint(event) {
          if (currentTool != tools.poly) {return}
          setPolylinePoints(prevPoints => [...prevPoints, { x: event.clientX, y: event.clientY }]);
        }

        function removePolylinePoint(event) {
          setPolylinePoints(prevPoints => prevPoints.slice(0, -1))
          drawPolyline(polylinePoints, event)
          // need to remove line section
        }
      
        function markPoly(points) {
          console.log("points markPoly: ", points)
          contextRef.current.moveTo(points[0].x, points[0].y)
          for (let i = 1; i < points.length; i++) {
            contextRef.current.lineTo(points[i].x, points[i].y);
          }
          contextRef.current.stroke();           
        }
        function drawPastPoly(context, points) {
          if (!context || !points[0]) {return}
          // const canvas = canvasRef.current;
          // const context = canvas.getContext('2d');
          console.log("points: ", points)
          context.beginPath();
          context.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
          }
          context.stroke();                    
        }

        function drawPolyline(points, event) {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.beginPath();
          context.moveTo(points[0].x, points[0].y);
          // if (points.length == 1) {
          //   // need event for line to mouse location
          //   // needs to follow mouse location?
          // }
          for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
          }
          // TODO: add to state variable; remove each time mouse moves; action when isDrawing
          context.lineTo(event.clientX, event.clientY); // line needs to be removed as mouse moves, stay after click
          context.stroke();
        }

        function markRectangle(x1, y1, x2, y2) {
          // TODO: unclear why position or rect changes??
          // const [canvas, context] = getCanvasContext()
          const widthX = (x2 - x1);
          const widthY = (y2 - y1);

          // const widthX = (x1 - x2);
          // const widthY = (y1 - y2);
          // contextRef.current.rect(x1, y1, widthX, widthY)
          // contextRef.current.stroke();
          contextRef.current.strokeRect(x1, y1, widthX, widthY);
          contextRef.current.restore();          
        }

        

        function drawRectangle(e) {
          if (!isDrawing){return}
          // action only if rectangle tool chosen
          // const [canvas, context] = getCanvasContext()
          // const rect = canvas.getBoundingClientRect()
          // const x = e.clientX - rect.left
          // const y = e.clientY - rect.top 
          // console.log("x, y: ", x, y)
          
          // e.preventDefault();
          // e.stopPropagation();
  
          const newMouseX = e.clientX - canvasOffSetX.current;
          const newMouseY = e.clientY - canvasOffSetY.current;
          endX.current = newMouseX; // can this wait until the end of the shape?
          endY.current = newMouseY; // why does this update?
  
          const rectWidth = newMouseX - startX.current;
          const rectHeight = newMouseY - startY.current;

          if (Math.abs(rectHeight) && Math.abs(rectWidth) > 10) {
            
                    // contextRef.current.clearRect(startX.current, startY.current, rectWidth, rectHeight);
                    contextRef.current.clearRect(0, 0, windowSize.width, windowSize.height);

            
                    contextRef.current.strokeRect(startX.current, startY.current, rectWidth, rectHeight);          


          }
          // if (isDrawing) {
            

          //   // get starting co-ord
          //   // should be if holds down longer than x distance
          //   const [x1, y1] = [x, y]
          //   console.log("x1, y1", x1, y1)
          //   setRectPoints([x1, y1])
          // }
          // else {
          //   // final co-ord
          //   if (!rectPoints.length) return
          //   const [x2, y2] = [x, y]

          //   const [x1, y1] = rectPoints
          //   setRectPoints(prev => [...prev.slice(0, 2), x2, y2])
          //   // add to totalLines
          //   // setTotalLines(prev => [...prev, rectPoints])
          //   console.log(rectPoints, "rect after x2")
          //   context.beginPath();
          //   const widthX = Math.abs(x1 - x2);
          //   const widthY = Math.abs(y1 - y2);
          //   console.log("markRect: ",x1, y1, widthX, widthY)
          //   markRectangle(x1, y1, widthX, widthY);
          //   setRectPoints([])
          //   // context.stroke();
          //   // context.restore();
          // }
        }
        
        function draw(event) {
          // TODO: add other tools than polyline
          // if mouse held down -> rectangle not polyline
          console.log("isDrawing in draw func:", isDrawing)
          if (!isDrawing) return
          dragCounter += 1
          if (currentTool == tools.poly) {

            if (polylinePoints.length > 0) {
              drawPolyline(polylinePoints, event);
              
            }
          }
          else if (currentTool == tools.rect) {
            // TODO: start drawing rectangle
            drawRectangle(event)

            
          // } else{
          //   drawRectangle(event)
          // }
        }}

        function lineComplete() {
          // how to add all lines and points to array?
          // TODO: add element with info on type; and points array
          setTotalLines(prev => [...prev, polylinePoints])
          setPolylinePoints([])
          setRectPoints([])
          console.log("line cleared")
        }

        function editLine(event) {
          // get last polyline drawn/ use current 
          // move last point to mouse click
          if (polylinePoints.length > 0) {
            // use current polyline
            removePolylinePoint(event)
          } 
          else {
            // access last polyline
            // lateer access polyline selected
          }
          console.log("edit function")
        }

        function handleToolChange(event) {
          console.log("toolChange:", event.target.value)
          console.log(event.target)
        }
        const canvasWidth = 4*500
  return (
    
      // return (
        <>
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
            
            onClick={lineComplete}>
            Complete Line
          </button>
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
            onClick={editLine}
          >
            Edit Line
          </button>
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
            onClick={handleUndo}
          >
            Undo
          </button>
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
            onClick={handleClear}
          >
            Clear
          </button>

          <div className='relative z-0'>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasWidth}
              // width={windowSize.width}
              // height={windowSize.height}
              className='border border-black rounded-md bg-transparent absolute inset-0 z-10'
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              // change below on tool selected
              onClick={addPolylinePoint}
              />
            <Image
              // loader={myLoader}
              src={fullPlanImage}
              alt="Plan image"
              width={canvasWidth}
              className= 'z-0'
              // fill
              // sizes="100vw"
              // style={{
                //   objectFit: 'cover',
                // }}
                // height={500}
                />
            </div>
        </>
      );
    }

export default Home;
