import {Prisma} from "../../generated/prisma-client";
import dotenv from "dotenv";

dotenv.config();
const prismaSecret = process.env.PRISMA_SECRET;
const prismaEndpoint = `http://${process.env.PRISMA_ENDPOINT}:${process.env.PRISMA_SERVE_PORT}`;
const wrappedPrisma = new Prisma({
   ...Prisma,
   secret: prismaSecret,
   endpoint: prismaEndpoint
});

export default wrappedPrisma;