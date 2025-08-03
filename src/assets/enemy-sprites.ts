// Enemy SVG sprites for tower defense game
// Each sprite is 40x40 pixels, designed for game use

export const ENEMY_SPRITES = {
  goblin: {
    left: `
      <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="#D9D9D9" stroke="black"/>
        <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="#2F9D50" stroke="black"/>
        <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M31 51H22V55H31V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="#905A28" stroke="black"/>
        <path d="M24 44V36H32.5V44H24Z" fill="#2F9D50" stroke="black"/>
        <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
        <path d="M3 43V35H11.5V38.5H7V43H3Z" fill="#2F9D50" stroke="black"/>
        <path d="M2 55.5V51H9.5V55.5H13V59.5H6V55.5H2Z" fill="#762F08" stroke="black"/>
        <path d="M38 55.5V51H30.5V55.5H27V59.5H34V55.5H38Z" fill="#762F08" stroke="black"/>
      </svg>
    `,
    middle: `
      <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="#D9D9D9" stroke="black"/>
        <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="#2F9D50" stroke="black"/>
        <path d="M34.5 55H22.5V58H34.5V55Z" fill="#762F08" stroke="black"/>
        <path d="M19 55H7V58H19V55Z" fill="#762F08" stroke="black"/>
        <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M34 51H25V55H34V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="#905A28" stroke="black"/>
        <path d="M13.5 51V43H22V51H13.5Z" fill="#2F9D50" stroke="black"/>
        <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
      </svg>
    `,
    right: `
      <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M34.5 44V36H26V39.5H30.5V44H34.5Z" fill="#2F9D50" stroke="black"/>
        <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="#D9D9D9" stroke="black"/>
        <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="#2F9D50" stroke="black"/>
        <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M31 51H22V55H31V51Z" fill="#37BAEA" stroke="black"/>
        <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="#905A28" stroke="black"/>
        <path d="M3 44V36H11.5V44H3Z" fill="#2F9D50" stroke="black"/>
        <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
        <path d="M2 55.5V51H9.5V55.5H13V59.5H6V55.5H2Z" fill="#762F08" stroke="black"/>
        <path d="M38 55.5V51H30.5V55.5H27V59.5H34V55.5H38Z" fill="#762F08" stroke="black"/>
      </svg>
    `,
  },

  orc: {
    leftFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <ellipse cx="20" cy="16" rx="8" ry="10" fill="#696969"/>
        <!-- Head -->
        <circle cx="20" cy="8" r="7" fill="#8b8b8b"/>
        <!-- Tusk -->
        <polygon points="16,8 14,6 18,7" fill="#f5f5dc"/>
        <!-- Eye -->
        <circle cx="18" cy="7" r="1.5" fill="#ff4444"/>
        <!-- Nose -->
        <ellipse cx="16" cy="10" rx="1" ry="2" fill="#696969"/>
        <!-- Arms -->
        <ellipse cx="12" cy="14" rx="4" ry="5" fill="#696969"/>
        <ellipse cx="28" cy="14" rx="4" ry="5" fill="#696969"/>
        <!-- Leg - Left foot forward (only one leg visible) -->
        <ellipse cx="20" cy="28" rx="3" ry="5" fill="#696969" transform="rotate(-60 20 28)"/>
        <!-- Foot -->
        <ellipse cx="20" cy="33" rx="4" ry="2" fill="#696969" transform="rotate(-60 20 33)"/>
        <!-- Shoulder armor -->
        <circle cx="12" cy="12" r="2" fill="#556b2f"/>
        <circle cx="28" cy="12" r="2" fill="#556b2f"/>
      </svg>
    `,
    rightFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <ellipse cx="20" cy="16" rx="8" ry="10" fill="#696969"/>
        <!-- Head -->
        <circle cx="20" cy="8" r="7" fill="#8b8b8b"/>
        <!-- Tusk -->
        <polygon points="16,8 14,6 18,7" fill="#f5f5dc"/>
        <!-- Eye -->
        <circle cx="18" cy="7" r="1.5" fill="#ff4444"/>
        <!-- Nose -->
        <ellipse cx="16" cy="10" rx="1" ry="2" fill="#696969"/>
        <!-- Arms -->
        <ellipse cx="12" cy="14" rx="4" ry="5" fill="#696969"/>
        <ellipse cx="28" cy="14" rx="4" ry="5" fill="#696969"/>
        <!-- Leg - Right foot forward (only one leg visible) -->
        <ellipse cx="20" cy="28" rx="3" ry="5" fill="#696969" transform="rotate(60 20 28)"/>
        <!-- Foot -->
        <ellipse cx="20" cy="33" rx="4" ry="2" fill="#696969" transform="rotate(60 20 33)"/>
        <!-- Shoulder armor -->
        <circle cx="12" cy="12" r="2" fill="#556b2f"/>
        <circle cx="28" cy="12" r="2" fill="#556b2f"/>
      </svg>
    `,
  },

  skeleton: {
    leftFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Skull -->
        <ellipse cx="20" cy="8" rx="6" ry="7" fill="#f5f5f5"/>
        <!-- Eye socket -->
        <ellipse cx="18" cy="7" rx="2" ry="2.5" fill="#2d2d2d"/>
        <!-- Nose hole -->
        <ellipse cx="16" cy="9" rx="1" ry="1.5" fill="#2d2d2d"/>
        <!-- Spine -->
        <rect x="19" y="15" width="2" height="8" fill="#f5f5f5"/>
        <!-- Ribs -->
        <ellipse cx="20" cy="17" rx="4" ry="1.5" fill="#f5f5f5" opacity="0.8"/>
        <ellipse cx="20" cy="19" rx="3" ry="1" fill="#f5f5f5" opacity="0.8"/>
        <!-- Arms -->
        <ellipse cx="14" cy="14" rx="2" ry="4" fill="#f5f5f5"/>
        <ellipse cx="26" cy="14" rx="2" ry="4" fill="#f5f5f5"/>
        <!-- Hands -->
        <circle cx="12" cy="12" r="1.5" fill="#f5f5f5"/>
        <circle cx="28" cy="12" r="1.5" fill="#f5f5f5"/>
        <!-- Leg - Left foot forward (only one leg visible) -->
        <ellipse cx="20" cy="26" rx="2" ry="4" fill="#f5f5f5" transform="rotate(-50 20 26)"/>
        <!-- Foot -->
        <ellipse cx="20" cy="30" rx="3" ry="2" fill="#f5f5f5" transform="rotate(-50 20 30)"/>
      </svg>
    `,
    rightFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Skull -->
        <ellipse cx="20" cy="8" rx="6" ry="7" fill="#f5f5f5"/>
        <!-- Eye socket -->
        <ellipse cx="18" cy="7" rx="2" ry="2.5" fill="#2d2d2d"/>
        <!-- Nose hole -->
        <ellipse cx="16" cy="9" rx="1" ry="1.5" fill="#2d2d2d"/>
        <!-- Spine -->
        <rect x="19" y="15" width="2" height="8" fill="#f5f5f5"/>
        <!-- Ribs -->
        <ellipse cx="20" cy="17" rx="4" ry="1.5" fill="#f5f5f5" opacity="0.8"/>
        <ellipse cx="20" cy="19" rx="3" ry="1" fill="#f5f5f5" opacity="0.8"/>
        <!-- Arms -->
        <ellipse cx="14" cy="14" rx="2" ry="4" fill="#f5f5f5"/>
        <ellipse cx="26" cy="14" rx="2" ry="4" fill="#f5f5f5"/>
        <!-- Hands -->
        <circle cx="12" cy="12" r="1.5" fill="#f5f5f5"/>
        <circle cx="28" cy="12" r="1.5" fill="#f5f5f5"/>
        <!-- Leg - Right foot forward (only one leg visible) -->
        <ellipse cx="20" cy="26" rx="2" ry="4" fill="#f5f5f5" transform="rotate(50 20 26)"/>
        <!-- Foot -->
        <ellipse cx="20" cy="30" rx="3" ry="2" fill="#f5f5f5" transform="rotate(50 20 30)"/>
      </svg>
    `,
  },

  demon: {
    leftFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <ellipse cx="20" cy="16" rx="8" ry="10" fill="#8b0000"/>
        <!-- Head -->
        <circle cx="20" cy="8" r="7" fill="#dc143c"/>
        <!-- Horns -->
        <polygon points="16,3 14,1 18,2" fill="#2d2d2d"/>
        <polygon points="24,3 26,1 22,2" fill="#2d2d2d"/>
        <!-- Eyes -->
        <circle cx="17" cy="7" r="1.5" fill="#ffd700"/>
        <circle cx="23" cy="7" r="1.5" fill="#ffd700"/>
        <!-- Glowing pupils -->
        <circle cx="17" cy="7" r="0.5" fill="#ffffff"/>
        <circle cx="23" cy="7" r="0.5" fill="#ffffff"/>
        <!-- Mouth -->
        <path d="M 18 11 Q 20 12 22 11" stroke="#2d2d2d" stroke-width="1" fill="none"/>
        <!-- Fangs -->
        <polygon points="19,11 20,12 21,11" fill="#ffffff"/>
        <!-- Arms -->
        <ellipse cx="12" cy="14" rx="3" ry="5" fill="#8b0000"/>
        <ellipse cx="28" cy="14" rx="3" ry="5" fill="#8b0000"/>
        <!-- Claws -->
        <polygon points="9,12 7,15 11,15" fill="#2d2d2d"/>
        <polygon points="31,12 33,15 29,15" fill="#2d2d2d"/>
        <!-- Leg - Left foot forward (only one leg visible) -->
        <ellipse cx="20" cy="28" rx="3" ry="5" fill="#dc143c" transform="rotate(-70 20 28)"/>
        <!-- Hooves -->
        <ellipse cx="20" cy="33" rx="4" ry="2" fill="#2d2d2d" transform="rotate(-70 20 33)"/>
        <!-- Fire aura -->
        <ellipse cx="20" cy="20" rx="15" ry="18" fill="none" stroke="#ff4500" stroke-width="1" opacity="0.3"/>
      </svg>
    `,
    rightFoot: `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <ellipse cx="20" cy="16" rx="8" ry="10" fill="#8b0000"/>
        <!-- Head -->
        <circle cx="20" cy="8" r="7" fill="#dc143c"/>
        <!-- Horns -->
        <polygon points="16,3 14,1 18,2" fill="#2d2d2d"/>
        <polygon points="24,3 26,1 22,2" fill="#2d2d2d"/>
        <!-- Eyes -->
        <circle cx="17" cy="7" r="1.5" fill="#ffd700"/>
        <circle cx="23" cy="7" r="1.5" fill="#ffd700"/>
        <!-- Glowing pupils -->
        <circle cx="17" cy="7" r="0.5" fill="#ffffff"/>
        <circle cx="23" cy="7" r="0.5" fill="#ffffff"/>
        <!-- Mouth -->
        <path d="M 18 11 Q 20 12 22 11" stroke="#2d2d2d" stroke-width="1" fill="none"/>
        <!-- Fangs -->
        <polygon points="19,11 20,12 21,11" fill="#ffffff"/>
        <!-- Arms -->
        <ellipse cx="12" cy="14" rx="3" ry="5" fill="#8b0000"/>
        <ellipse cx="28" cy="14" rx="3" ry="5" fill="#8b0000"/>
        <!-- Claws -->
        <polygon points="9,12 7,15 11,15" fill="#2d2d2d"/>
        <polygon points="31,12 33,15 29,15" fill="#2d2d2d"/>
        <!-- Leg - Right foot forward (only one leg visible) -->
        <ellipse cx="20" cy="28" rx="3" ry="5" fill="#dc143c" transform="rotate(70 20 28)"/>
        <!-- Hooves -->
        <ellipse cx="20" cy="33" rx="4" ry="2" fill="#2d2d2d" transform="rotate(70 20 33)"/>
        <!-- Fire aura -->
        <ellipse cx="20" cy="20" rx="15" ry="18" fill="none" stroke="#ff4500" stroke-width="1" opacity="0.3"/>
      </svg>
    `,
  },
} as const;

export type EnemyType = keyof typeof ENEMY_SPRITES;
