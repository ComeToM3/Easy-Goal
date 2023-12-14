import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request for fetching user metabolic data
    try {
      const userId = req.query.userId;
      const { startOfDay, endOfDay } = DayFilter();

      const anthroData = await prisma.Metabolisme.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: userId,
        },
      });

      if (anthroData) {
        res.status(200).json(anthroData);
      } else {
        res.status(404).json({ message: "User metabolic data not found" });
      }
    } catch (error) {
      console.error("Error fetching user metabolic data:", error);
      res
        .status(500)
        .json({ message: "Error fetching user metabolic data", error });
    }
  } else if (req.method === "PUT") {
    // Handle PUT request for updating user metabolic data
    try {
      const { ID, CA, MB, BEE } = req.body;
      const { startOfDay, endOfDay } = DayFilter();

      await prisma.Metabolisme.update({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
        data: {
          ca: CA.toString(),
          mb: MB.toString(),
          bee: BEE.toString(),
          timeSp: new Date(),
        },
      });

      res.status(200).json({ message: "Mise à jour réussie" });
      {
        res.status(404).json({ message: "Aucune entrée à mettre à jour" });
      }
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la requête", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
