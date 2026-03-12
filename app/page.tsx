"use client"

import { useState, useEffect, useRef } from "react"

/* ─────────────────────────────────────────────────────────────
   Animated floating background orbs  (pure CSS — no deps)
───────────────────────────────────────────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
      {/* Deep gradient base */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59,130,246,0.12) 0%, transparent 70%), #050b18" }}
      />
      {/* Large purple orb */}
      <div className="animate-orb absolute rounded-full opacity-30"
        style={{ width: 520, height: 520, top: "-10%", left: "5%", background: "radial-gradient(circle, rgba(124,58,237,0.55) 0%, transparent 70%)", animationDuration: "22s" }}
      />
      {/* Blue orb */}
      <div className="animate-orb absolute rounded-full opacity-20"
        style={{ width: 400, height: 400, bottom: "0%", right: "2%", background: "radial-gradient(circle, rgba(59,130,246,0.60) 0%, transparent 70%)", animationDuration: "28s", animationDelay: "-8s" }}
      />
      {/* Gold accent orb */}
      <div className="animate-orb absolute rounded-full opacity-15"
        style={{ width: 280, height: 280, top: "55%", left: "55%", background: "radial-gradient(circle, rgba(245,158,11,0.70) 0%, transparent 70%)", animationDuration: "35s", animationDelay: "-14s" }}
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Crown SVG icon
───────────────────────────────────────────────────────────── */
function CrownIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 19h20v2H2v-2zm2-2l2-9 4 5 2-7 2 7 4-5 2 9H4z" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Difficulty badge colours
───────────────────────────────────────────────────────────── */
const difficultyMeta: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "#10b981" },
  normal: { label: "Normal", color: "#a78bfa" },
  expert: { label: "Expert", color: "#ef4444" },
}

/* ─────────────────────────────────────────────────────────────
   Main game component
───────────────────────────────────────────────────────────── */
export default function Home() {

  const [size, setSize] = useState(8)

  const createBoard = (n: number) =>
    Array(n).fill(null).map(() => Array(n).fill(false))

  const [board, setBoard] = useState(createBoard(size))

  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  const [hint, setHint] = useState<string | null>(null)
  const [solving, setSolving] = useState(false)

  const [bestTime, setBestTime] = useState<number | null>(null)

  const [difficulty, setDifficulty] = useState("normal")

  const [tabActive, setTabActive] = useState(true)

  const placeSound = useRef<HTMLAudioElement | null>(null)
  const removeSound = useRef<HTMLAudioElement | null>(null)
  const winSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {

    placeSound.current = new Audio("/sounds/place.mp3")
    removeSound.current = new Audio("/sounds/remove.mp3")
    winSound.current = new Audio("/sounds/win.mp3")

  }, [])

  /* TIMER */

  useEffect(() => {

    let timer: NodeJS.Timeout

    if (running) {
      timer = setInterval(() => setTime(t => t + 1), 1000)
    }

    return () => clearInterval(timer)

  }, [running])

  /* TAB VISIBILITY DETECTOR */

  useEffect(() => {

    function handleVisibility() {

      if (document.hidden) {
        setTabActive(false)
      }
      else {
        setTabActive(true)
      }

    }

    document.addEventListener("visibilitychange", handleVisibility)

    return () => document.removeEventListener("visibilitychange", handleVisibility)

  }, [])

  /* BEST TIME */

  useEffect(() => {

    const record = localStorage.getItem(`best-${size}`)

    if (record) setBestTime(parseInt(record))
    else setBestTime(null)

  }, [size])

  /* CHESS RULES */

  function isSafe(board: boolean[][], row: number, col: number) {

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {

        if (!board[r][c]) continue

        if (r === row) return false
        if (c === col) return false
        if (Math.abs(r - row) === Math.abs(c - col)) return false

      }
    }

    return true
  }

  function getConflicts(board: boolean[][]) {

    if (difficulty === "expert") return new Set<string>()

    const conflicts = new Set<string>()

    for (let r1 = 0; r1 < size; r1++) {
      for (let c1 = 0; c1 < size; c1++) {

        if (!board[r1][c1]) continue

        for (let r2 = 0; r2 < size; r2++) {
          for (let c2 = 0; c2 < size; c2++) {

            if (r1 === r2 && c1 === c2) continue
            if (!board[r2][c2]) continue

            if (
              r1 === r2 ||
              c1 === c2 ||
              Math.abs(r1 - r2) === Math.abs(c1 - c2)
            ) {
              conflicts.add(`${r1}-${c1}`)
              conflicts.add(`${r2}-${c2}`)
            }

          }
        }

      }
    }

    return conflicts
  }

  const conflicts = getConflicts(board)

  const queenCount = board.flat().filter(Boolean).length
  const solved = queenCount === size && conflicts.size === 0

  /* TAB TITLE TIMER */

  useEffect(() => {

    if (!tabActive) {
      document.title = "⏱️ Come back! Your puzzle awaits"
      return
    }

    if (solved) {
      document.title = `♛ N Queens — Solved in ${time}s 🎉`
    }
    else if (running) {
      document.title = `♛ N Queens — ${time}s`
    }
    else {
      document.title = "♛ N Queens Game"
    }

  }, [time, running, solved, tabActive])

  /* WIN DETECT */

  useEffect(() => {

    if (solved) {

      setRunning(false)

      winSound.current?.play()

      const key = `best-${size}`
      const prev = localStorage.getItem(key)

      if (!prev || time < parseInt(prev)) {
        localStorage.setItem(key, time.toString())
        setBestTime(time)
      }

    }

  }, [solved])

  /* PLACE QUEEN */

  function toggleQueen(row: number, col: number) {

    if (solving) return

    if (!running) setRunning(true)

    const newBoard = board.map(r => [...r])

    const placing = !newBoard[row][col]

    newBoard[row][col] = placing

    if (placing) {
      placeSound.current!.currentTime = 0
      placeSound.current!.play()
    }
    else {
      removeSound.current!.currentTime = 0
      removeSound.current!.play()
    }

    setBoard(newBoard)
    setMoves(m => m + 1)
    setHint(null)

  }

  /* RESET */

  function resetBoard() {

    setBoard(createBoard(size))
    setMoves(0)
    setTime(0)
    setRunning(false)
    setHint(null)

  }

  /* SMART HINT */

  function getSmartHint() {

    if (difficulty === "expert") return

    const solution = solveNQueens()

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {

        if (solution[r][c] && !board[r][c]) {
          setHint(`${r}-${c}`)
          return
        }

      }
    }

  }

  /* SOLVER */

  function solveNQueens() {

    const temp = createBoard(size)

    function backtrack(row: number) {

      if (row === size) return true

      for (let col = 0; col < size; col++) {

        if (isSafe(temp, row, col)) {

          temp[row][col] = true

          if (backtrack(row + 1)) return true

          temp[row][col] = false

        }

      }

      return false
    }

    backtrack(0)

    return temp
  }

  /* SOLVE STEP */

  function solveStep() {

    const solution = solveNQueens()

    const newBoard = board.map(r => [...r])

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {

        if (solution[r][c] && !newBoard[r][c]) {
          newBoard[r][c] = true
          setBoard(newBoard)
          return
        }

      }
    }

  }

  /* VISUAL BACKTRACK SOLVER */

  async function solvePuzzle() {

    if (solving) return

    setSolving(true)

    const temp = createBoard(size)

    async function backtrack(row: number) {

      if (row === size) return true

      for (let col = 0; col < size; col++) {

        if (isSafe(temp, row, col)) {

          temp[row][col] = true
          setBoard(temp.map(r => [...r]))
          await new Promise(r => setTimeout(r, 200))

          if (await backtrack(row + 1)) return true

          temp[row][col] = false
          setBoard(temp.map(r => [...r]))
          await new Promise(r => setTimeout(r, 200))

        }

      }

      return false
    }

    await backtrack(0)

    setSolving(false)

  }

  /* ─── Format time helper ─── */
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`

  /* ─── Tile size based on board size ─── */
  const tileSize = size <= 8 ? "clamp(44px,6.5vw,64px)" : size <= 10 ? "clamp(38px,5.5vw,54px)" : "clamp(32px,4.5vw,46px)"

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <>
      <BackgroundOrbs />

      <main className="flex items-center justify-center min-h-screen px-4 py-8 animate-fade-in-up">

        <div className="glass-card flex flex-col items-center p-6 sm:p-10 w-full max-w-max">

          {/* ── Header ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-6 text-center">

            <div className="animate-float mb-3 text-amber-400">
              <CrownIcon size={42} />
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              className="glow-text font-extrabold tracking-tight leading-none mb-1">
              N Queens
            </h1>

            <p className="text-slate-400 text-sm tracking-wide">
              Place <span className="text-violet-300 font-semibold">{size}</span> queens so none attack each other
            </p>

            {/* Difficulty badge */}
            <span className="mt-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                color: difficultyMeta[difficulty].color,
                background: difficultyMeta[difficulty].color + "22",
                border: `1px solid ${difficultyMeta[difficulty].color}55`,
              }}>
              {difficultyMeta[difficulty].label} Mode
            </span>

          </div>

          {/* ── Stats Row ─────────────────────────────────────────── */}
          <div className="flex gap-3 mb-5 flex-wrap justify-center">

            <div className="stat-badge">
              <span className="stat-label">⚔ Moves</span>
              <span className="stat-value">{moves}</span>
            </div>

            <div className="stat-badge">
              <span className="stat-label">⏱ Time</span>
              <span className="stat-value" style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(time)}</span>
            </div>

            <div className="stat-badge">
              <span className="stat-label">♛ Queens</span>
              <span className="stat-value">{queenCount} / {size}</span>
            </div>

            {bestTime !== null && (
              <div className="stat-badge" style={{ borderColor: "rgba(16,185,129,0.4)", background: "rgba(16,185,129,0.08)" }}>
                <span className="stat-label" style={{ color: "#10b981" }}>🏆 Best</span>
                <span className="stat-value" style={{ color: "#34d399" }}>{fmt(bestTime)}</span>
              </div>
            )}

          </div>

          {/* ── Controls Row ──────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 mb-5 justify-center items-center">

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="game-select"
              >
                <option value="beginner">Beginner</option>
                <option value="normal">Normal</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="w-px h-5 bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Board</label>
              <select
                value={size}
                onChange={(e) => {

                  const n = parseInt(e.target.value)

                  setSize(n)
                  setBoard(createBoard(n))
                  setMoves(0)
                  setTime(0)
                  setRunning(false)
                  setHint(null)

                }}
                className="game-select"
              >
                {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>{n} × {n}</option>
                ))}
              </select>
            </div>

          </div>

          {/* ── Action Buttons ────────────────────────────────────── */}
          <div className="flex gap-2 mb-6 flex-wrap justify-center">

            <button onClick={resetBoard} className="btn btn-reset">
              <span>↺</span> Reset
            </button>

            <button
              onClick={getSmartHint}
              className="btn btn-hint"
              disabled={difficulty === "expert"}
              title={difficulty === "expert" ? "Hints disabled in Expert mode" : "Show a hint"}
            >
              <span>💡</span> Hint
            </button>

            <button onClick={solveStep} className="btn btn-step">
              <span>→</span> Step
            </button>

            <button onClick={solvePuzzle} className="btn btn-solve" disabled={solving}>
              {solving
                ? <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> Solving…</>
                : <><span>⚡</span> Solve</>
              }
            </button>

          </div>

          {/* ── Solved Banner ─────────────────────────────────────── */}
          {solved && (
            <div className="solved-banner mb-5 text-center text-sm sm:text-base animate-fade-in-up">
              🎉 Puzzle Solved in {fmt(time)}! &nbsp;·&nbsp; {moves} moves
            </div>
          )}

          {/* ── Board ─────────────────────────────────────────────── */}
          {/* ── Board ─────────────────────────────────────────────── */}
          <div className="board-glow-wrapper relative overflow-hidden">

            {/* rotating glow layer */}
            <div
              className="absolute inset-0 rounded-2xl blur-2xl opacity-60 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(168,85,247,0.35), rgba(59,130,246,0.35), rgba(234,179,8,0.35), rgba(168,85,247,0.35))",
                animation: "boardGlowRotate 12s linear infinite"
              }}
            />

            {/* LIGHT SWEEP EFFECT */}
            <div className="board-light-sweep pointer-events-none" />

            {/* Soft inner glow */}
            <div
              className="absolute inset-2 rounded-xl blur-xl opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(167,139,250,0.25), transparent 70%)"
              }}
            />

            <div className="board-inner relative">
              <div
                className="grid"
                role="grid"
                aria-label="N-Queens board"
                style={{ gridTemplateColumns: `repeat(${size}, ${tileSize})` }}
              >

                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {

                    const isLight = (rowIndex + colIndex) % 2 === 0
                    const key = `${rowIndex}-${colIndex}`
                    const isConflict = conflicts.has(key)
                    const isHint = hint === key

                    let tileClass = "tile "
                    if (isHint) tileClass += "tile-hint"
                    else if (isConflict) tileClass += "tile-conflict"
                    else tileClass += isLight ? "tile-light" : "tile-dark"

                    return (
                      <div
                        key={key}
                        role="gridcell"
                        aria-label={`Row ${rowIndex + 1}, Col ${colIndex + 1}${cell ? ", queen" : ""}`}
                        onClick={() => toggleQueen(rowIndex, colIndex)}
                        className={tileClass}
                        style={{ width: tileSize, height: tileSize }}
                      >

                        {cell && (
                          <span
                            key={`q-${key}-${cell}`}
                            className="queen-piece"
                            style={{ fontSize: `calc(${tileSize} * 0.52)` }}
                            aria-hidden
                          >
                            ♛
                          </span>
                        )}

                      </div>
                    )

                  })
                )}

              </div>
            </div>

          </div>

          {/* ── Footer hint ───────────────────────────────────────── */}
          <p className="mt-4 text-xs text-slate-600 text-center">
            Click a square to place or remove a queen &nbsp;·&nbsp; v1.0
          </p>
        </div>   {/* glass-card */}
      </main>
    </>
  )
}