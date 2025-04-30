import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";

export default function LinkedListVisualization() {
  const [nodes, setNodes] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationMode, setAnimationMode] = useState("none"); // 'none', 'add', 'delete'
  const [stepDescription, setStepDescription] = useState("");
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const animationTimeoutRef = useRef(null);

  // Animation descriptions
  const addAnimationSteps = [
    "Starting to add a new node",
    "Creating a new node with the value",
    "Updating next pointers",
    "Node has been added to the list",
  ];

  const deleteAnimationSteps = [
    "Starting to delete a node",
    "Finding the node to delete",
    "Updating next pointers to skip the node",
    "Node has been removed from the list",
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
      setInputValue(value);
    }
  };

  const startAddAnimation = () => {
    if (inputValue === "") return;

    const value = parseInt(inputValue);
    const index = Math.min(nodes.length, targetIndex);

    setTargetValue(value);
    setAnimationMode("add");
    setAnimationStep(0);
    setAnimating(true);
    setAnimationPlaying(true);
    updateStepDescription("add", 0);
  };

  const startDeleteAnimation = () => {
    if (nodes.length === 0) return;

    const index = Math.min(nodes.length - 1, targetIndex);
    setAnimationMode("delete");
    setAnimationStep(0);
    setAnimating(true);
    setAnimationPlaying(true);
    updateStepDescription("delete", 0);
  };

  const updateStepDescription = (mode, step) => {
    if (mode === "add") {
      setStepDescription(addAnimationSteps[step]);
    } else if (mode === "delete") {
      setStepDescription(deleteAnimationSteps[step]);
    }
  };

  const nextAnimationStep = () => {
    if (!animating) return;

    if (animationStep < 3) {
      setAnimationStep((prevStep) => prevStep + 1);
      updateStepDescription(animationMode, animationStep + 1);
    } else {
      // Complete the animation
      if (animationMode === "add") {
        const newNodes = [...nodes];
        newNodes.splice(targetIndex, 0, targetValue);
        setNodes(newNodes);
        setInputValue("");
      } else if (animationMode === "delete") {
        const newNodes = [...nodes];
        newNodes.splice(targetIndex, 1);
        setNodes(newNodes);
      }

      setAnimating(false);
      setAnimationMode("none");
      setAnimationStep(0);
      setStepDescription("");
      setAnimationPlaying(false);
    }
  };

  const prevAnimationStep = () => {
    if (!animating || animationStep === 0) return;

    setAnimationStep((prevStep) => prevStep - 1);
    updateStepDescription(animationMode, animationStep - 1);
  };

  const resetAnimation = () => {
    setAnimating(false);
    setAnimationMode("none");
    setAnimationStep(0);
    setStepDescription("");
    setAnimationPlaying(false);
    clearTimeout(animationTimeoutRef.current);
  };

  const resetAll = () => {
    resetAnimation();
    setNodes([10, 20, 30]);
    setInputValue("");
    setTargetIndex(0);
  };

  const togglePlayPause = () => {
    setAnimationPlaying(!animationPlaying);
  };

  useEffect(() => {
    if (animationPlaying && animating) {
      animationTimeoutRef.current = setTimeout(() => {
        nextAnimationStep();
      }, 1500);
    }

    return () => {
      clearTimeout(animationTimeoutRef.current);
    };
  }, [animationPlaying, animating, animationStep]);

  // Helper to determine node status for animation
  const getNodeStatus = (index) => {
    if (!animating) return "normal";

    if (animationMode === "add") {
      if (animationStep === 0) {
        return index === targetIndex ? "target" : "normal";
      } else if (animationStep === 1) {
        return index === targetIndex ? "highlight" : "normal";
      } else if (animationStep === 2) {
        if (index === targetIndex - 1 || index === targetIndex) {
          return "highlight";
        }
        return "normal";
      } else {
        return "normal";
      }
    } else if (animationMode === "delete") {
      if (animationStep === 0) {
        return index === targetIndex ? "target" : "normal";
      } else if (animationStep === 1) {
        return index === targetIndex ? "highlight" : "normal";
      } else if (animationStep === 2) {
        if (index === targetIndex - 1 || index === targetIndex) {
          return "highlight";
        }
        return index === targetIndex ? "delete" : "normal";
      } else {
        return index === targetIndex ? "delete" : "normal";
      }
    }

    return "normal";
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white p-4 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Linked List Visualization
      </h1>

      {/* Controls */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value"
            className="border-2 border-gray-300 rounded px-3 py-2 w-32"
            disabled={animating}
          />

          <div className="flex items-center">
            <button
              onClick={() => setTargetIndex(Math.max(0, targetIndex - 1))}
              disabled={animating || targetIndex === 0}
              className={`p-2 rounded ${
                animating || targetIndex === 0
                  ? "bg-gray-300"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="mx-2">Position: {targetIndex}</span>
            <button
              onClick={() =>
                setTargetIndex(Math.min(nodes.length, targetIndex + 1))
              }
              disabled={animating || targetIndex === nodes.length}
              className={`p-2 rounded ${
                animating || targetIndex === nodes.length
                  ? "bg-gray-300"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={startAddAnimation}
            disabled={animating || inputValue === ""}
            className={`flex items-center px-6 py-2 rounded ${
              animating || inputValue === ""
                ? "bg-gray-300"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <Plus size={18} className="mr-2" /> Add Node
          </button>

          <button
            onClick={startDeleteAnimation}
            disabled={animating || nodes.length === 0}
            className={`flex items-center px-6 py-2 rounded ${
              animating || nodes.length === 0
                ? "bg-gray-300"
                : "bg-gray-700 hover:bg-gray-800 text-white"
            }`}
          >
            <Trash size={18} className="mr-2" /> Delete Node
          </button>

          <button
            onClick={resetAll}
            className="flex items-center px-6 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <RotateCcw size={18} className="mr-2" /> Reset
          </button>
        </div>

        {animating && (
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={prevAnimationStep}
              disabled={animationStep === 0 || animationPlaying}
              className={`px-4 py-2 rounded ${
                animationStep === 0 || animationPlaying
                  ? "bg-gray-300"
                  : "bg-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              Previous Step
            </button>

            <button
              onClick={togglePlayPause}
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white flex items-center"
            >
              {animationPlaying ? (
                <>
                  <Pause size={18} className="mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play size={18} className="mr-2" /> Play
                </>
              )}
            </button>

            <button
              onClick={nextAnimationStep}
              disabled={animationPlaying}
              className={`px-4 py-2 rounded ${
                animationPlaying
                  ? "bg-gray-300"
                  : "bg-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              Next Step
            </button>
          </div>
        )}

        {stepDescription && (
          <div className="text-lg font-medium p-4 bg-gray-100 rounded w-full text-center">
            {stepDescription}
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <div className="flex items-center justify-start min-w-max p-4">
          <div className="flex items-center justify-center px-4 py-2 border-2 border-gray-700 rounded bg-gray-100">
            <span className="font-bold">Head</span>
          </div>

          <div className="flex items-center">
            {nodes.map((value, index) => {
              const nodeStatus = getNodeStatus(index);

              // New node animation
              let newNodeElement = null;
              if (
                animating &&
                animationMode === "add" &&
                animationStep >= 1 &&
                index === targetIndex
              ) {
                newNodeElement = (
                  <div
                    className={`flex flex-col items-center transform ${
                      animationStep < 3 ? "translate-y-10 opacity-70" : ""
                    } transition-all duration-500`}
                    key="new-node"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold border-4 
                        ${
                          animationStep === 1
                            ? "bg-orange-500 border-orange-600"
                            : animationStep === 2
                            ? "bg-orange-500 border-orange-600"
                            : "bg-gray-700 border-gray-800"
                        }`}
                    >
                      {targetValue}
                    </div>
                    <div className="mt-2 text-sm">New</div>
                  </div>
                );
              }

              return (
                <React.Fragment key={index}>
                  {/* Insert new node before the current one if this is the target position */}
                  {animating &&
                    animationMode === "add" &&
                    animationStep >= 1 &&
                    index === targetIndex &&
                    newNodeElement}

                  <div className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${
                        nodeStatus === "delete" && animationStep === 3
                          ? "opacity-50 transform translate-y-6"
                          : ""
                      } transition-all duration-500`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold border-4
                          ${
                            nodeStatus === "target"
                              ? "bg-orange-500 border-orange-600"
                              : nodeStatus === "highlight"
                              ? "bg-orange-500 border-orange-600"
                              : nodeStatus === "delete"
                              ? "bg-red-500 border-red-600"
                              : "bg-gray-700 border-gray-800"
                          }
                          transition-all duration-300`}
                      >
                        {value}
                      </div>
                      <div className="mt-2 text-sm">Node {index}</div>
                    </div>

                    {index < nodes.length - 1 && (
                      <div
                        className={`w-16 h-2 bg-gray-400 mx-1 ${
                          animating &&
                          animationMode === "delete" &&
                          index === targetIndex - 1 &&
                          animationStep >= 2
                            ? "w-32 bg-orange-400"
                            : ""
                        } transition-all duration-500`}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Add a floating new node at the end if we're adding at the end of the list */}
            {animating &&
              animationMode === "add" &&
              animationStep >= 1 &&
              targetIndex === nodes.length && (
                <div
                  className={`flex flex-col items-center transform ${
                    animationStep < 3 ? "translate-y-10 opacity-70" : ""
                  } transition-all duration-500`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold border-4 
                    ${
                      animationStep === 1
                        ? "bg-orange-500 border-orange-600"
                        : animationStep === 2
                        ? "bg-orange-500 border-orange-600"
                        : "bg-gray-700 border-gray-800"
                    }`}
                  >
                    {targetValue}
                  </div>
                  <div className="mt-2 text-sm">New</div>
                </div>
              )}

            <div className="flex items-center justify-center px-4 py-2 border-2 border-gray-700 rounded bg-gray-100 ml-4">
              <span className="font-bold">NULL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
