import { db } from "../../../../lib/firebaseConfig";
import DayFilter from "@/utils/dayFilter";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit
} from "firebase/firestore/lite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const ID = req.query.id;
      const { startOfMonth, endOfMonth } = DayFilter();

      const objectifsCollection = collection(db, "Objectifs");

      const q = query(
        objectifsCollection,
        where("userId", "==", ID),
        orderBy("timeSp", "desc"), 
        limit(1) 
      );
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot);

      const objectifsData = [];
      querySnapshot.forEach((doc) => {
        objectifsData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
        
      res.status(200).json(objectifsData);
    } catch (error) {
      console.error("Erreur :", error);
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
      console.error("Erreur :", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
