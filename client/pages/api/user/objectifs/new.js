import { v4 as uuidv4 } from "uuid";

import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { ID, LTG, OBJ1, ACT1, TOA1, OBJ2, ACT2, TOA2, OWK, PSB,  } = req.body;
      const { startOfDay, endOfDay } = DayFilter();
      const userId = uuidv4();

     
      const existingTimeSp = await prisma.Objectifs.findFirst({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });

      if (existingTimeSp !== null && existingTimeSp.length > 0 && existingTimeSp.length < 2) {
        return res.status(400).json({ message: "Une entrée par jour" });
      }
      
      

      const MetabolEntry = await prisma.Objectifs.create({
        data: {
          id: userId.toString(),
          ltg: LTG,
          obj1: OBJ1,
          act1: ACT1,
          toa1: TOA1,
          obj2: OBJ2,
          act2: ACT2,
          toa2: TOA2,
          owk: OWK,
          psb: PSB,
          timeSp: new Date(),
          userId: ID,
        },
      });

      res.status(200).json({ message: "Inscription réussie" });
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
