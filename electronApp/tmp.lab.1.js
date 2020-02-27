const closure1 = [
   {x: 1, y: 1, z: 1},
   {x: 1, y: 1, z: 2},
   {x: 2, y: 1, z: 1},
   {x: 2, y: 1, z: 3},
];

const isClosure = (closure, keysFrom, keysTo) => {
   const values = {};

   const updateClosure = (preW, keys) => {
      for (let i = 0; i < closure.length; i++)
         closure[i][preW + keys] = keys.length > 1 ?
            keys.split("").reduce((p, n) => "" + closure[i][p] + closure[i][n]) : "" + closure[i][keys];
   };

   updateClosure("t_", keysTo);
   updateClosure("f_", keysFrom);

   closure.forEach(keys => {
      if (!!values[keys["f_" + keysFrom]]) values[keys["f_" + keysFrom]].add("" + keys["t_" + keysTo]);
      else values[keys["f_" + keysFrom]] = new Set().add(keys["t_" + keysTo])
   });

   return (Object.keys(values)).every(n => values[n].size <= 1);
};

console.log(isClosure(closure1, "xy", "x"));
