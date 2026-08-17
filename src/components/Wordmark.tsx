// Reuses Primitive AI's shared icon mark (sibling to the FBA Screener /
// Fracta Flow product), paired with this product's own text lockup —
// "Strategy Library" has no dedicated brand kit yet, so the wordmark is
// built rather than supplied as a single SVG asset.
export function Wordmark({ className = '', height = 28 }: { className?: string; height?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/brand/icon-black.svg"
        alt=""
        height={height}
        className="block dark:hidden"
        style={{ height }}
      />
      <img
        src="/brand/icon-white.svg"
        alt=""
        height={height}
        className="hidden dark:block"
        style={{ height }}
      />
      <span className="font-display font-bold text-[#111111] dark:text-white" style={{ fontSize: height * 0.6 }}>
        Strategy Library
      </span>
    </span>
  )
}
