import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request for fetching user metabolic data
    try {
      const ID = req.query.userId;
      const { startOfDay, endOfDay } = DayFilter();

      const motivResData = await prisma.MoyRes.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });
      if (motivResData) {
        res.status(200).json(motivResData);
      }
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de la requête", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
