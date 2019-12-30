import {Prisma} from "../../generated/prisma-client";

const dockerPrisma = new Prisma({
    ...Prisma,
    endpoint: "http://prisma:4466"
});

export default dockerPrisma;