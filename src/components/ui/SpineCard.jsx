/*
  A surface that belongs to one colour: the subject cards on the dashboard
  (pages/Dashboard.jsx ResumeCard/SubjectCard), and any other row or card that
  should carry the same material rather than a flat border.

  The look is the server design language (src/server.css, .subject-card): a
  tight-cornered panel with a coloured left edge, a dot-matrix texture fading
  in from the right, a status LED in the corner, and a data packet that runs
  across the top edge on hover. It is all CSS. It replaced a WebGL silk
  shader that ran one GL context per card.

  `lift` opts into the shared hover treatment for cards that are themselves
  the click target. `as` renders it as a different element (e.g. 'li' inside
  an <ol>). `rounded` is accepted so existing call sites keep working, but the
  corner radius is now set once in server.css.
*/
// eslint-disable-next-line no-unused-vars
export default function SpineCard({ color, as: As = 'div', className = '', rounded, lift = false, children }) {
  return (
    <As
      className={`subject-card card relative min-w-0 overflow-hidden ${lift ? 'card-lift' : ''} ${className}`}
      style={{ '--subject': color }}
    >
      <i aria-hidden="true" className="srv-led" />
      <div className="relative">{children}</div>
    </As>
  )
}
