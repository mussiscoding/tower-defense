// Enemy SVG sprites for tower defense game
// Each sprite is 40x40 pixels, designed for game use

// Function to generate the goblin sprite with configurable skin and shirt colors
type GenerateGoblinSpriteProps = {
  skinColor: string;
  shirtColor: string;
  hairColor: string;
};
const generateGoblinSprite = ({
  skinColor,
  shirtColor,
  hairColor,
}: GenerateGoblinSpriteProps) => ({
  left: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="${hairColor}" stroke="black"/>
      <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="${skinColor}" stroke="black"/>
      <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M31 51H22V55H31V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="${shirtColor}" stroke="black"/>
      <path d="M24 44V36H32.5V44H24Z" fill="${skinColor}" stroke="black"/>
      <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
      <path d="M3 43V35H11.5V38.5H7V43H3Z" fill="${skinColor}" stroke="black"/>
      <path d="M2 55.5V51H9.5V55.5H13V59.5H6V55.5H2Z" fill="#762F08" stroke="black"/>
      <path d="M38 55.5V51H30.5V55.5H27V59.5H34V55.5H38Z" fill="#762F08" stroke="black"/>
    </svg>
  `,
  middle: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="${hairColor}" stroke="black"/>
      <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="${skinColor}" stroke="black"/>
      <path d="M34.5 55H22.5V58H34.5V55Z" fill="#762F08" stroke="black"/>
      <path d="M19 55H7V58H19V55Z" fill="#762F08" stroke="black"/>
      <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M34 51H25V55H34V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="${shirtColor}" stroke="black"/>
      <path d="M13.5 51V43H22V51H13.5Z" fill="${skinColor}" stroke="black"/>
      <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
    </svg>
  `,
  right: `
    <svg width="20" height="30" viewBox="0 0 39 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M34.5 44V36H26V39.5H30.5V44H34.5Z" fill="${skinColor}" stroke="black"/>
      <path d="M4.5 13H1V5H8.5V1H24V5H32.5V13H37V29.5H28.5V25.5H24V21.5H20.5V25.5H13V20.5H8.5V17H4.5V13Z" fill="${hairColor}" stroke="black"/>
      <path d="M2.5 28.5V13.5H4.5V17H8.5V20.5H13V25.5H20.5V21.5H24V25.5H28.5V30H33V33.5H28.5V35H9.5V32.5H6V28.5H2.5Z" fill="${skinColor}" stroke="black"/>
      <path d="M18.5 51H9.5V55H18.5V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M31 51H22V55H31V51Z" fill="#37BAEA" stroke="black"/>
      <path d="M27 35H7V39V47V51H31.5L31 39H27V35Z" fill="${shirtColor}" stroke="black"/>
      <path d="M3 44V36H11.5V44H3Z" fill="${skinColor}" stroke="black"/>
      <path d="M5 26.5V22H7V26.5H5Z" fill="#120F0F" stroke="black"/>
      <path d="M2 55.5V51H9.5V55.5H13V59.5H6V55.5H2Z" fill="#762F08" stroke="black"/>
      <path d="M38 55.5V51H30.5V55.5H27V59.5H34V55.5H38Z" fill="#762F08" stroke="black"/>
    </svg>
  `,
});

export const ENEMY_SPRITES = {
  goblin: generateGoblinSprite({
    skinColor: "#2F9D50",
    shirtColor: "#905A28",
    hairColor: "#8B4513",
  }), // Green skin, light brown shirt, brown hair
  orc: generateGoblinSprite({
    skinColor: "#696969",
    shirtColor: "#8B4513",
    hairColor: "#2F2F2F",
  }), // Grey skin, brown shirt, dark hair
  skeleton: generateGoblinSprite({
    skinColor: "#D2B48C",
    shirtColor: "#8B4513",
    hairColor: "#F5F5DC",
  }), // Tan skin, brown shirt, light hair
  demon: generateGoblinSprite({
    skinColor: "#8B0000",
    shirtColor: "#000000",
    hairColor: "#2F2F2F",
  }), // Red skin, black shirt, dark hair
} as const;

export type EnemyType = keyof typeof ENEMY_SPRITES;
