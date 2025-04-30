import React, { useState, useRef, useEffect } from "react";
import "./LinkedListVisualizer.css";

const LinkedListVisualizer = () => {
  const [list, setList] = useState([]);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  const addNode = (val) => {
    if (!val) return;
    const newNode = {
      id: Date.now(),
      value: val,
      x: 100 + list.length * 120,
      y: 200,
      next: null,
    };

    if (list.length > 0) {
      const updatedList = [...list];
      updatedList[updatedList.length - 1].next = newNode.id;
      setList([...updatedList, newNode]);
    } else {
      setList([newNode]);
    }
    setValue("");
  };

  const deleteNode = (id) => {
    if (list.length === 0) return;

    if (list.length === 1) {
      setList([]);
      return;
    }

    const index = list.findIndex((node) => node.id === id);
    if (index === -1) return;

    const updatedList = [...list];
    if (index > 0) {
      updatedList[index - 1].next = updatedList[index].next;
    }
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  const startDemo = () => {
    setStep(0);
    setIsPlaying(true);
  };

  const nextStep = () => {
    if (step >= 4) {
      setIsPlaying(false);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const reset = () => {
    setList([]);
    setStep(0);
    setIsPlaying(false);
  };

  const handleDragStart = (e, id) => {
    setSelectedNode(id);
  };

  const handleDrag = (e) => {
    if (selectedNode === null) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setList(
      list.map((node) => {
        if (node.id === selectedNode) {
          return { ...node, x, y };
        }
        return node;
      })
    );
  };

  const handleDragEnd = () => {
    setSelectedNode(null);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setTimeout(() => {
        nextStep();
      }, 1500);
    }
    return () => clearTimeout(animationRef.current);
  }, [isPlaying, step]);

  useEffect(() => {
    switch (step) {
      case 0:
        reset();
        break;
      case 1:
        setList([{ id: 1, value: "A", x: 200, y: 200, next: null }]);
        break;
      case 2:
        setList([
          { id: 1, value: "A", x: 200, y: 200, next: 2 },
          { id: 2, value: "B", x: 350, y: 200, next: null },
        ]);
        break;
      case 3:
        setList([
          { id: 1, value: "A", x: 200, y: 200, next: 2 },
          { id: 2, value: "B", x: 350, y: 200, next: 3 },
          { id: 3, value: "C", x: 500, y: 200, next: null },
        ]);
        break;
      case 4:
        setList([
          { id: 2, value: "B", x: 275, y: 200, next: 3 },
          { id: 3, value: "C", x: 425, y: 200, next: null },
        ]);
        break;
      default:
        break;
    }
  }, [step]);

  return (
    <div className="visualizer-container">
      <h1>Linked List Visualization</h1>

      <div
        className="canvas"
        ref={canvasRef}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* HEAD pointer */}
        <div className="head-pointer">
          <span>HEAD</span>
          <div className="arrow">
            {list.length > 0 ? (
              <>
                <div
                  className="arrow-line"
                  style={{
                    width: `${Math.sqrt(
                      Math.pow(list[0].x - 50, 2) + Math.pow(list[0].y - 50, 2)
                    )}px`,
                    transform: `rotate(${Math.atan2(
                      list[0].y - 50,
                      list[0].x - 50
                    )}rad)`,
                    left: "50px",
                    top: "50px",
                  }}
                ></div>
                <div
                  className="arrow-head"
                  style={{
                    left: `${list[0].x - 10}px`,
                    top: `${list[0].y - 10}px`,
                    transform: `rotate(${Math.atan2(
                      list[0].y - 50,
                      list[0].x - 50
                    )}rad)`,
                  }}
                ></div>
              </>
            ) : (
              <div className="null-arrow">→ NULL</div>
            )}
          </div>
        </div>

        {/* Nodes */}
        {list.map((node, index) => (
          <React.Fragment key={node.id}>
            <div
              className={`node ${selectedNode === node.id ? "dragging" : ""}`}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              draggable
              onMouseDown={(e) => handleDragStart(e, node.id)}
              onClick={() => deleteNode(node.id)}
            >
              <div className="value">{node.value}</div>
              <div className="next-pointer">
                {index < list.length - 1 ? (
                  <>
                    <div
                      className="arrow-line"
                      style={{
                        width: `${Math.sqrt(
                          Math.pow(list[index + 1].x - node.x - 40, 2) +
                            Math.pow(list[index + 1].y - node.y - 20, 2)
                        )}px`,
                        transform: `rotate(${Math.atan2(
                          list[index + 1].y - node.y - 20,
                          list[index + 1].x - node.x - 40
                        )}rad)`,
                        left: "40px",
                        top: "20px",
                      }}
                    ></div>
                    <div
                      className="arrow-head"
                      style={{
                        left: `${list[index + 1].x - node.x - 10}px`,
                        top: `${list[index + 1].y - node.y - 10}px`,
                        transform: `rotate(${Math.atan2(
                          list[index + 1].y - node.y - 20,
                          list[index + 1].x - node.x - 40
                        )}rad)`,
                      }}
                    ></div>
                  </>
                ) : (
                  <div className="null-arrow">→ NULL</div>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="controls">
        <button onClick={startDemo} className="control-btn">
          Start
        </button>
        <button onClick={nextStep} className="control-btn">
          Next Step
        </button>
        <button onClick={reset} className="control-btn">
          Reset
        </button>
      </div>

      <div className="add-node">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Node value"
          maxLength="1"
        />
        <button onClick={() => addNode(value)} className="add-btn">
          Add Node
        </button>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
