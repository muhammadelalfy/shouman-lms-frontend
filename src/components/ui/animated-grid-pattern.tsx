// Adapted from Magic UI, MIT. See THIRD-PARTY-NOTICES.md for pinned source and license.
"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { motion, useInView } from "motion/react"

import { useReducedMotion } from "./use-reduced-motion"
import { cn } from "./class-names"

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
}

type Square = {
  id: number
  pos: [number, number]
  iteration: number
}

export function AnimatedGridPattern({
  width = 64,
  height = 64,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 8,
  className,
  maxOpacity = 0.12,
  duration = 1.5,
  repeatDelay = 0,
  ...props
}: AnimatedGridPatternProps) {
  const reduced = useReducedMotion()
  const id = useId()
  const containerRef = useRef<SVGSVGElement | null>(null)
  const inView = useInView(containerRef, { amount: 0.1 })
  const dimensions = useRef({ width: 0, height: 0 })
  const [squares, setSquares] = useState<Array<Square>>([])

  const getPos = useCallback((): [number, number] => {
    return [
      Math.floor((Math.random() * dimensions.current.width) / width),
      Math.floor((Math.random() * dimensions.current.height) / height),
    ]
  }, [height, width])

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
        iteration: 0,
      }))
    },
    [getPos]
  )


  useEffect(() => {
    const element = containerRef.current
    if (!element || typeof ResizeObserver === "undefined") return
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        dimensions.current = { width: entry.contentRect.width, height: entry.contentRect.height }
        setSquares(reduced ? [] : generateSquares(numSquares))
      }
    })
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [generateSquares, numSquares, reduced])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      data-component="21st-animated-grid-pattern"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-gold fill-gold/10 stroke-gold/25",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M${width/2} 4 ${width*.65} ${height*.35} ${width-4} ${height/2} ${width*.65} ${height*.65} ${width/2} ${height-4} ${width*.35} ${height*.65} 4 ${height/2} ${width*.35} ${height*.35}Z M${width*.2} ${height*.2}H${width*.8}V${height*.8}H${width*.2}Z`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {!reduced && inView && squares.map(({ pos: [squareX, squareY], id, iteration }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay,
            }}
            key={`${id}-${iteration}`}
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1}
            y={squareY * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  )
}
