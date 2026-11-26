import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Trace = { d: string; dur: number; delay: number };

const TRACES: Trace[] = [
  { d: "M-20 90 H140 L200 150 H320 L360 110 H520", dur: 7, delay: 0 },
  { d: "M-20 300 H90 L150 240 H300 L340 280 H560 L610 330 H820", dur: 9, delay: 1.4 },
  { d: "M1220 60 H1050 L1000 110 H860 L820 150 H640", dur: 8, delay: 0.6 },
  { d: "M1220 420 H1080 L1020 360 H900 L850 410 H700 L660 370 H520", dur: 10, delay: 2.2 },
  { d: "M120 620 H320 L380 560 H540 L600 610 H900 L960 550 H1220", dur: 11, delay: 0.9 },
  { d: "M60 780 H260 L310 730 H470 L520 780 H760", dur: 8.5, delay: 3 },
  { d: "M-20 480 H120 L170 530 H280", dur: 6.5, delay: 1.8 },
  { d: "M1220 700 H1040 L990 750 H840", dur: 7.5, delay: 2.6 },
];

const NODES = [
  [140, 90],
  [320, 150],
  [150, 240],
  [560, 300],
  [1050, 60],
  [860, 110],
  [1020, 360],
  [700, 410],
  [380, 560],
  [900, 610],
  [310, 730],
  [760, 780],
  [170, 530],
  [990, 750],
];

export function CircuitBackground({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();
  const traces = useMemo(() => (isMobile ? TRACES.slice(0, 4) : TRACES), [isMobile]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-70"
      >
        <defs>
          <linearGradient id="traceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold-deep)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--silver)" stopOpacity="0.12" />
          </linearGradient>
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {traces.map((t, i) => (
          <path
            key={`p-${i}`}
            id={`trace-${i}`}
            d={t.d}
            fill="none"
            stroke="url(#traceGrad)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}

        {NODES.map(([x, y], i) => (
          <circle
            key={`n-${i}`}
            cx={x}
            cy={y}
            r="3"
            fill="none"
            stroke="var(--gold-deep)"
            strokeWidth="1.2"
            opacity="0.55"
          />
        ))}

        {traces.map((t, i) => (
          <circle key={`d-${i}`} r="2.6" fill="var(--gold)" filter="url(#dotGlow)" opacity="0">
            <animateMotion
              dur={`${t.dur}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
              path={t.d}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.85;1"
              dur={`${t.dur}s`}
              begin={`${t.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

export default CircuitBackground;
