import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
 
    try {
      const ID = req.query.userId;
      const { startOfMonth, endOfMonth } = DayFilter();

      const objectifsData = await prisma.Objectifs.findFirst({
        where: {
          timeSp: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
          userId: ID,
        },
      });
      if (objectifsData) {
        res.status(200).json(objectifsData);
      } else {
        res.status(404).json({ message: "Données non trouvées" });
      }
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la requête", error });
    }
  } else if (req.method === "PUT") {
    try {
      const { ID, LTG, OBJ1, IPT, ACT1, TOA1, OBJ2, ACT2, TOA2, OWK, PSB } =
        req.body;

        const { startOfMonth, endOfMonth } = DayFilter();

      const updatedObjectifsData = await prisma.Objectifs.update({
        where: {
          timeSp: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
          userId: ID,
        },
        data: {
          ltg: LTG,
          toa1: TOA1,
          toa2: TOA2,
          owk: OWK,
          psb: PSB,
          ipt: IPT,
          obj1: OBJ1,
          act1: ACT1,
          obj2: OBJ2,
          act2: ACT2,
          timeSp: new Date(),
        },
      });

      res.status(200).json(updatedObjectifsData);
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
