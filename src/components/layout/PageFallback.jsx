/*
  Shown for the instant a page's code is being fetched. Pages load on demand
  (see App.jsx), so the landing page no longer waits on the whole app.
*/
export default function PageFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand motion-reduce:animate-none" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
