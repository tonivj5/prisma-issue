import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  await prisma.$connect();

  const app = express();

  app.get("/issue", async (req, res) => {
    try {
      await prisma.$transaction(async (prisma) => {
        // console.log("do nothing");
      });

      res.status(200).json({ ok: true });
    } catch (e) {
      // This error outputs:
      // Error
      //     at Object.transaction (/.../prisma-issue-tx/starter/node_modules/@prisma/client/runtime/index.js:36083:55)
      //     at async PrismaClient._transactionWithCallback (/.../prisma-issue-tx/starter/node_modules/@prisma/client/runtime/index.js:39451:9) {
      //   code: 'StringExpected'
      // }

      // The error it hides (response from engine):
      // error_code:'P2028'
      // is_panic:false
      // message:'Transaction API error: Unable to start a transaction in the given time.'
      // meta:{error: 'Unable to start a transaction in the given time.'}
      console.error(e);

      res.status(500).json({ error: true });
    }
  });

  app.listen(3333, () => {
    console.log("Start at localhost:3333");
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
