const BODY = "#3D2B1F";
const BACK = "#2A1A10";
const BELLY = "#5C4033";
const EYE = "#CCFF00";
const CLAWS = "#222";
const FAR_LEG = "#1A0F08";
const FAR_CLAW = "#111";

export const generateBeastSprite = () => ({
  left: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 42H14V46H14Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M14 44H17V48H14Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M16 48H19V50H16Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M27 42H30V46H30Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M24 46H27V50H24Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M21 50H24V52H21Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M20 52H25V54H20Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M34 30H39V34H34Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M6 32H34V36H6Z" fill="${BACK}" stroke="black" stroke-width="0.5"/>
      <path d="M6 34H34V42H6Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M10 40H30V42H10Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M1 30H10V42H1Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 36H2V42H-2Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 40H1V42H-2Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 26H7V30H3Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M4 27H6V30H4Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 34H5V36H3Z" fill="${EYE}"/>
      <path d="M-1 40H1V42H-1Z" fill="white" stroke="black" stroke-width="0.3"/>
      <path d="M7 42H10V46H10Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M4 46H7V50H4Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M1 50H4V52H1Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M0 52H5V54H0Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
      <path d="M29 42H32V46H32Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M32 44H35V48H32Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M34 48H37V50H34Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
    </svg>
  `,
  middle: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 42H14V52H11Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M10 52H15V54H10Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M28 42H31V52H28Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M27 52H32V54H27Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M34 30H39V34H34Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M6 32H34V36H6Z" fill="${BACK}" stroke="black" stroke-width="0.5"/>
      <path d="M6 34H34V42H6Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M10 40H30V42H10Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M1 30H10V42H1Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 36H2V42H-2Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 40H1V42H-2Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 26H7V30H3Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M4 27H6V30H4Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 34H5V36H3Z" fill="${EYE}"/>
      <path d="M-1 40H1V42H-1Z" fill="white" stroke="black" stroke-width="0.3"/>
      <path d="M7 42H10V52H7Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M6 52H11V54H6Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
      <path d="M25 42H28V52H25Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M24 52H29V54H24Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
    </svg>
  `,
  right: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 42H14V46H14Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M8 46H11V50H8Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M5 50H8V52H5Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M4 52H9V54H4Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M27 42H30V46H30Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M30 44H33V48H30Z" fill="${FAR_LEG}" stroke="black" stroke-width="0.5"/>
      <path d="M32 48H35V50H32Z" fill="${FAR_CLAW}" stroke="black" stroke-width="0.5"/>
      <path d="M34 30H39V34H34Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M6 32H34V36H6Z" fill="${BACK}" stroke="black" stroke-width="0.5"/>
      <path d="M6 34H34V42H6Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M10 40H30V42H10Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M1 30H10V42H1Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 36H2V42H-2Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M-2 40H1V42H-2Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 26H7V30H3Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M4 27H6V30H4Z" fill="${BELLY}" stroke="black" stroke-width="0.5"/>
      <path d="M3 34H5V36H3Z" fill="${EYE}"/>
      <path d="M-1 40H1V42H-1Z" fill="white" stroke="black" stroke-width="0.3"/>
      <path d="M7 42H10V46H10Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M10 44H13V48H10Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M13 46H16V48H13Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M14 48H17V50H14Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
      <path d="M27 42H30V46H30Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M24 46H27V50H24Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M21 50H24V52H21Z" fill="${BODY}" stroke="black" stroke-width="0.5"/>
      <path d="M20 52H25V54H20Z" fill="${CLAWS}" stroke="black" stroke-width="0.5"/>
    </svg>
  `,
});
