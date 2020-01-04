import {Prisma} from "../../generated/prisma-client";
import dotenv from "dotenv";

dotenv.config();
const prismaEndpoint = `http://${process.env.PRISMA_ENDPOINT}:${process.env.PRISMA_SERVE_PORT}`;
const dockerPrisma = new Prisma({
    ...Prisma,
    endpoint: prismaEndpoint
});

export default dockerPrisma;