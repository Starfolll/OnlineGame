import {Prisma} from "../../generated/prisma-client";

export default new Prisma({
    ...Prisma,
    endpoint: "http://prisma:4466"
});