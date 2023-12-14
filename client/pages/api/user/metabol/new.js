//main/pages/api/signup.js
import { v4 as uuidv4 } from "uuid";

import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { ID, CA, MB, BEE } = req.body;
      const { startOfDay, endOfDay } = DayFilter();
      const userId = uuidv4();
      const existingTimeSp = await prisma.Metabolisme.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });

      if (existingTimeSp.length > 0 && existingTimeSp.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });

      }

      const MetabolEntry = await prisma.Metabolisme.create({
        data: {
          id: userId.toString(),
          ca: CA.toString(),
          mb: MB.toString(),
          bee: BEE.toString(),
          timeSp: new Date(),
          userId: ID
        },
      });

      res.status(200).json({ message: "Inscription réussie"});
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
