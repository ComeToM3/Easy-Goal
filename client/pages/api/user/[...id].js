import prisma from "../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Handle GET request for fetching user metabolic data
    try {
      const userId = req.query.userId;
      const userData = await prisma.User.findFirst({
        where: {
          userId: userId,
        },

        select: {
          prenom: true,
      }
      });
      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: "User data not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res
        .status(500)
        .json({ message: "Error fetching user data", error });
    }
  }}