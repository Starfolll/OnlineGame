"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = require("../../generated/prisma-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prismaSecret = process.env.PRISMA_SECRET;
const prismaEndpoint = `http://${process.env.PRISMA_ENDPOINT}:${process.env.PRISMA_SERVE_PORT}`;
const wrappedPrisma = new prisma_client_1.Prisma(Object.assign(Object.assign({}, prisma_client_1.Prisma), { secret: prismaSecret, endpoint: prismaEndpoint }));
exports.default = wrappedPrisma;
