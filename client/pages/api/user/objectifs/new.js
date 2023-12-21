import { v4 as uuidv4 } from "uuid";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore/lite";

import { db } from "../../../../lib/firebaseConfig";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { ID, LTG, OBJ1,  IPT, ACT1, TOA1, OBJ2, ACT2, TOA2, OWK, PSB } =
        req.body;
      const { startOfMonth, endOfMonth } = DayFilter();
      const userId = uuidv4();

      const existingTimeSpQuery = query(
        collection(db, "Objectifs"),
       where("timeSp", ">=", startOfMonth),
       where("timeSp", "<", endOfMonth),
        where("userId", "==", ID)
      );

      const existingTimeSpSnapshot = await getDocs(existingTimeSpQuery);

      console.log(existingTimeSpSnapshot);
      if (!existingTimeSpSnapshot.empty) {
        return res.status(400).json({ message: "Une entrée par mois" });
      }

      const newEntryData = {
        id: userId.toString(),
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
        userId: ID,
      };

      await addDoc(collection(db, "Objectifs"), newEntryData);

      res.status(200).json({ message: "Inscription réussie" });
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
