//main/pages/api/signup.js
import { v4 as uuidv4 } from "uuid";

import { db } from "../../../../lib/firebaseConfig";

import { collection, query, where, getDocs, addDoc } from "firebase/firestore/lite";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { ID, IMC, KG, CM, AGE, GEN, CA } = req.body;
      const { startOfDay, endOfDay } = DayFilter();
      const userId = uuidv4();

      // Vérifier si l'email existe déjà dans la base de données
      const existingTimeSp = await prisma.Anthropometrie.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: ID,
        },
      });

      if (existingTimeSp.length > 0 && existingTimeSp.length < 2) {
        return res.status(400).json({ message: "Une seule entrée par jour est autorisée." });
      }

      const AnthroEntry = await prisma.Anthropometrie.create({
        data: {
          id: userId,
          imc: IMC,
          kg: KG,
          cm: CM,
          age: AGE,
          gen: GEN,
          ca: CA,
          timeSp: new Date(),
          userId: ID
        },
      });

      res.status(200).json({ message: "Inscription réussie"});
    } catch (error) {
      console.error("Erreur :", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
