const xpPerLvl = 100;
const xpPerLvlMultiplier = 1.052;

const lvlFormulas = {
   xpToNextLvl: (currentLvl: number): number => {
      return (xpPerLvl * (currentLvl * xpPerLvlMultiplier)) * ((xpPerLvlMultiplier * (currentLvl - 1)) + 1);
   },
};

export default lvlFormulas;