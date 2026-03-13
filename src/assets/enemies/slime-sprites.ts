const BODY = "#4A8F29";
const HIGHLIGHT = "#6BBF3B";
const DARK = "#2D5A14";
const EYE = "#FFEE00";
const PUPIL = "#111";
const MOUTH = "#1A3D0A";

export const generateSlimeSprite = () => ({
  left: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 56H36V60H3Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M4 12H35V56H4Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M7 8H32V12H7Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M11 4H28V8H11Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M22 5H28V10H22Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M28 10H33V16H28Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M4 44H35V56H4Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M6 18H14V27H6Z" fill="${EYE}"/>
      <path d="M7 20H12V26H7Z" fill="${PUPIL}"/>
      <path d="M5 32H15V35H5Z" fill="${MOUTH}" stroke="black" stroke-width="0.3"/>
    </svg>
  `,
  middle: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 56H38V60H1Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M2 18H37V56H2Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M5 14H34V18H5Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M9 10H30V14H9Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M24 11H30V16H24Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M30 16H35V22H30Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M2 44H37V56H2Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M4 24H13V33H4Z" fill="${EYE}"/>
      <path d="M5 26H11V32H5Z" fill="${PUPIL}"/>
      <path d="M3 37H14V40H3Z" fill="${MOUTH}" stroke="black" stroke-width="0.3"/>
    </svg>
  `,
  right: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 56H39V60H0Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M0 28H39V56H0Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 24H36V28H3Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M7 20H33V24H7Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M26 21H33V26H26Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M32 26H37V32H32Z" fill="${HIGHLIGHT}" stroke="black" stroke-width="0.3"/>
      <path d="M0 46H39V56H0Z" fill="${DARK}" stroke="black" stroke-width="0.5"/>
      <path d="M2 30H11V37H2Z" fill="${EYE}"/>
      <path d="M3 31H10V36H3Z" fill="${PUPIL}"/>
      <path d="M1 40H13V43H1Z" fill="${MOUTH}" stroke="black" stroke-width="0.3"/>
    </svg>
  `,
});
