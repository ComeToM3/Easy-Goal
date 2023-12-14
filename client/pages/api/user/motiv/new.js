//main/pages/api/signup.js
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../../lib/prismaClient";
import DayFilter from "@/utils/dayFilter";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        dataPreContemp,
        dataContemp,
        dataAction,
        dataMaintenance,
        dataRes,
      } = req.body;
      
      const { startOfDay, endOfDay } = DayFilter();
      const userId = uuidv4();

      // console.log("precont", dataPreContemp,
      //  "cont", dataContemp,
      //  "acti", dataAction,
      //  "Maint", dataMaintenance,
      //  "res", dataRes);
      
      // PreContemplation
      const existingTimeSp1 = await prisma.PreContemplation.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: dataPreContemp.ID,
        },
      });

      if (existingTimeSp1.length > 0 && existingTimeSp1.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });
      }

      const preContempEntry = await prisma.PreContemplation.create({
        data: {
          id: userId,
          userId: dataPreContemp.ID,
          q1: dataPreContemp.q1,
          q5: dataPreContemp.q5,
          q11: dataPreContemp.q11,
          q13: dataPreContemp.q13,
          q32: dataPreContemp.q32,
          q26: dataPreContemp.q26,
          q29: dataPreContemp.q29,
          q31: dataPreContemp.q31,
          timeSp: new Date(),
        },
      });

      // Contemplation
      const existingTimeSp2 = await prisma.Contemplation.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: dataPreContemp.ID,
        },
      });

      if (existingTimeSp2.length > 0 && existingTimeSp2.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });
      }

      const contemplationEntry = await prisma.Contemplation.create({
        data: {
          id: userId,
          userId: dataPreContemp.ID,
          q2: dataContemp.q2,
          q4: dataContemp.q4,
          q8: dataContemp.q8,
          q12: dataContemp.q12,
          q15: dataContemp.q15,
          q19: dataContemp.q19,
          q21: dataContemp.q21,
          q24: dataContemp.q24,
          timeSp: new Date(),
        },
      });

      // Action
      const existingTimeSp3 = await prisma.Action.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: dataPreContemp.ID,
        },
      });

      if (existingTimeSp3.length > 0 && existingTimeSp3.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });
      }

      const acitionEntry = await prisma.Action.create({
        data: {
          id: userId,
          userId: dataPreContemp.ID,
          q3: dataAction.q3,
          q7: dataAction.q7,
          q10: dataAction.q10,
          q14: dataAction.q14,
          q17: dataAction.q17,
          q20: dataAction.q20,
          q25: dataAction.q25,
          q30: dataAction.q30,
          timeSp: new Date(),
        },
      });

      //Maintient
      const existingTimeSp4 = await prisma.Maintenance.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: dataPreContemp.ID,
        },
      });

      if (existingTimeSp4.length > 0 && existingTimeSp4.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });
      }

      const maintenanceEntry = await prisma.Maintenance.create({
        data: {
          id: userId,
          userId: dataPreContemp.ID,
          q6: dataMaintenance.q6,
          q9: dataMaintenance.q9,
          q16: dataMaintenance.q16,
          q18: dataMaintenance.q18,
          q22: dataMaintenance.q22,
          q27: dataMaintenance.q27,
          q28: dataMaintenance.q28,
          q32: dataMaintenance.q32,
          timeSp: new Date(),
        },
      });
      
      // Resultat Final

      const existingTimeSp5 = await prisma.MoyRes.findMany({
        where: {
          timeSp: {
            gte: startOfDay,
            lt: endOfDay,
          },
          userId: dataPreContemp.ID,
        },
      });

      if (existingTimeSp5.length > 0 && existingTimeSp5.length < 2) {
        return res.status(400).json({ message: "Une entree par jour" });
      }

      const moyResEntry = await prisma.MoyRes.create({
        data: {
          id: userId,
          userId: dataPreContemp.ID,
          moyPc: dataRes.moyPc,
          moyC: dataRes.moyC,
          moyA: dataRes.moyA,
          moyM: dataRes.moyM,
          res: dataRes.res,
          timeSp: new Date(),
        },
      });
      res.status(200).json({ message: "Inscription réussie" });
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
