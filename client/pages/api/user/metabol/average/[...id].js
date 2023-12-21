import { db } from "../../../../../lib/firebaseConfig";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  
   if (req.method === "GET") {
    try {
      const userId = req.query.userId;
      const { startOfDay, endOfDay, startOfMonth, endOfMonth } = DayFilter();

      const averageMetabolData = await prisma.Metabolisme.findFirst({
        where: {
          timeSp: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
          userId: userId,
        },
      });

      if (averageMetabolData) {
        res.status(200).json(averageMetabolData);
      } else {
        res.status(404).json({ message: "User metabolic data not found" });
      }
    } catch (error) {
      console.error("Error fetching user metabolic data:", error);
      res
        .status(500)
        .json({ message: "Error fetching user metabolic data", error });
    }
  } 
}
