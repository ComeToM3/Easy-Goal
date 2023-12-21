import { db } from "../../../../lib/firebaseConfig";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request for fetching user metabolic data
    try {
      const ID = req.query.userId;
      const { startOfDay, endOfDay } = DayFilter();

      const macronuData = await prisma.Macronutriments.findFirst({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });
      if (macronuData) {
        res.status(200).json(macronuData);
      } else {
        res.status(404).json({ message: "User macronu data not found" });
      }
    } catch (error) {
      console.error("Error fetching user macronu data:", error);
      res
        .status(500)
        .json({ message: "Error fetching user macronu data", error });
    }
  } else if (req.method === "PUT") {
    // Handle PUT request for updating user macronu data
    try {
      const { id, ID, GLCP, GLCG, LIPP, LIPG, PROP, PROG } = req.body;
      const { startOfDay, endOfDay } = DayFilter();
      await prisma.Macronutriments.update({
        where: {
          id: id,
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
        data: {
          glcP: GLCP.toString(),
          glcG: GLCG.toString(),
          lipP: LIPP.toString(),
          lipG: LIPG.toString(),
          proP: PROP.toString(),
          proG: PROG.toString(),
          timeSp: new Date(),
        },
      });

      res.status(200).json({ message: "Mise à jour réussie" });
      {
        res.status(404).json({ message: "Aucune entrée à mettre à jour" });
      }
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ message: "Erreur lors de la requête", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
