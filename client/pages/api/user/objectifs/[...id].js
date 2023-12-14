import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request for fetching user metabolic data
    try {
      const ID = req.query.userId;
      const { startOfDay, endOfDay } = DayFilter();

      const objectifData = await prisma.Objectifs.findFirst({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });
      if (objectifData) {
        res.status(200).json(objectifData);
      } else {
        res.status(404).json({ message: "Données non trouvées" });
      }
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la requête", error });
    }
  } else if (req.method === "PUT") {
    try {
      const { ID, LTG, OBJ1, ACT1, TOA1, OBJ2, ACT2, TOA2, OWK, PSB } =
        req.body;

      // Logique de mise à jour dans la base de données
      const updatedObjectifData = await prisma.Objectifs.update({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
        data: {
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
        },
      });

      res.status(200).json(updatedObjectifData);
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
