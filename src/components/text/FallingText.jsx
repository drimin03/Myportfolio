/*
	Installed from https://reactbits.dev/tailwind/
*/

import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";

const FallingText = ({
  text = "",
  highlightWords = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "1rem",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [effectStarted, setEffectStarted] = useState(false);
  const [canRetrigger, setCanRetrigger] = useState(false);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const updateLoopRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(" ");

    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span
          class="inline-block mx-[2px] select-none px-3 py-1 border-2 border-gray-400 rounded-full ${isHighlighted ? "text-orange-500 font-[manrope3] border-orange-400" : ""}"
        >
          ${word}
        </span>`;
      })
      .join(" ");

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  const cleanupPhysics = () => {
    if (updateLoopRef.current) {
      cancelAnimationFrame(updateLoopRef.current);
      updateLoopRef.current = null;
    }
    
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current);
      if (renderRef.current.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(renderRef.current.canvas);
      }
      renderRef.current = null;
    }
    
    if (runnerRef.current) {
      Matter.Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
    
    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
  };

  const resetWordsToOriginalPosition = () => {
    if (!textRef.current) return;
    
    const wordSpans = textRef.current.querySelectorAll("span");
    wordSpans.forEach((elem) => {
      elem.style.position = "static";
      elem.style.left = "auto";
      elem.style.top = "auto";
      elem.style.transform = "none";
    });
  };

  const startPhysicsEffect = () => {
    if (!containerRef.current || !textRef.current) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    engineRef.current = engine;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });
    renderRef.current = render;

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(
      width / 2,
      height + 25,
      width,
      50,
      boundaryOptions,
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height,
      boundaryOptions,
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      boundaryOptions,
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -25,
      width,
      50,
      boundaryOptions,
    );

    const wordSpans = textRef.current.querySelectorAll("span");
    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.4,
        frictionAir: 0.005,
        friction: 0.8,
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 3,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);

      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute";
      elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`;
      elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`;
      elem.style.transform = "none";
    });

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map((wb) => wb.body),
    ]);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    let settlementTimer = null;
    let lastMovement = Date.now();

    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;

        // Check if bodies are still moving
        if (Math.abs(body.velocity.x) > 0.1 || Math.abs(body.velocity.y) > 0.1 || Math.abs(body.angularVelocity) > 0.01) {
          lastMovement = Date.now();
        }
      });

      Matter.Engine.update(engine);

      // Check if objects have settled
      if (Date.now() - lastMovement > 2000 && !canRetrigger) {
        if (settlementTimer) clearTimeout(settlementTimer);
        settlementTimer = setTimeout(() => {
          setCanRetrigger(true);
          cleanupPhysics();
          resetWordsToOriginalPosition();
        }, 1000);
      }

      updateLoopRef.current = requestAnimationFrame(updateLoop);
    };
    updateLoop();
  };

  useEffect(() => {
    if (!effectStarted) return;

    cleanupPhysics();
    resetWordsToOriginalPosition();
    setCanRetrigger(false);
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      startPhysicsEffect();
    }, 10);

    return cleanupPhysics;
  }, [
    effectStarted,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
  ]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    } else if (canRetrigger && (trigger === "click" || trigger === "hover")) {
      setCanRetrigger(false);
      setEffectStarted(false);
      // Trigger effect again after a brief moment
      setTimeout(() => {
        setEffectStarted(true);
      }, 10);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-full cursor-pointer text-center pt-8 overflow-hidden"
      onClick={trigger === "click" || trigger === "hover" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="inline-block"
        style={{
          fontSize: fontSize,
          lineHeight: 1.2,
        }}
      />

      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
};

export default FallingText;