import { useApp } from '@/context/AppProvider'
import Icon from '@/components/ui/Icon'
import { THEME_TOGGLE } from '@/constants/content'
import { revealTheme } from '@/lib/themeTransition'

/*
  The header theme toggle: a sun/moon pill that flips the site between its two
  themes, cream and black, with the new theme spreading out from the button
  as a circle (lib/themeTransition.js). Looks live in index.css (.theme-toggle).

  High contrast is deliberately not part of it - that is an accessibility
  setting and stays in Settings > Appearance. It counts as "black" here (it is
  a dark theme), so the switch reads on, and turning it off lands on cream.
*/
export default function ThemeSwitcher() {
  const { theme, setTheme } = useApp()
  const isBlack = theme !== 'cream'
  const next = isBlack ? 'cream' : 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isBlack}
      aria-label={THEME_TOGGLE.label}
      title={isBlack ? THEME_TOGGLE.toCream : THEME_TOGGLE.toBlack}
      data-state={isBlack ? 'black' : 'cream'}
      onClick={(e) => revealTheme(() => setTheme(next), e.currentTarget)}
      className="theme-toggle"
    >
      <span className="theme-toggle-stars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="theme-toggle-knob" aria-hidden="true">
        <Icon name="sun" className="theme-toggle-icon theme-toggle-sun" />
        <Icon name="moon" className="theme-toggle-icon theme-toggle-moon" />
      </span>
    </button>
  )
}
