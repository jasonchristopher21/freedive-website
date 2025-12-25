"use client"
import React from "react"

type Props = {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
}

export default function CircularProgress({
  value,
  size = 96,
  strokeWidth = 10,
  className = "",
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={`inline-block ${className}`} aria-hidden={false}>
      <svg width={size} height={size} className="block">
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle
            r={radius}
            cx={0}
            cy={0}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            className="text-muted/30"
            style={{ stroke: "rgba(148,163,184,0.15)" }}
          />
        </g>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            stroke="#6366f1"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </g>
      </svg>
      <div
        className="-mt-[calc(1.125rem+0px)] text-center w-full"
        style={{ marginTop: `-${size}px`, height: `${size}px`, pointerEvents: "none" }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-sm font-semibold text-foreground">
            {clamped}%
          </div>
        </div>
      </div>
    </div>
  )
}
