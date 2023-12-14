//main/pages/api/signup.js

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userPrenom, userNom, userEmail, userPassword } = req.body;


      // Vérifier si l'email existe déjà dans la base de données
      const existingUser = await prisma.User.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const userId = uuidv4();

      const hashedPassword = await bcrypt.hash(userPassword, 10);

      const signupEntry = await prisma.User.create({
        data: {
          id: userId.toString(),
          prenom: userPrenom,
          nom: userNom,
          email: userEmail.toString(),
          password: hashedPassword.toString(),
          timeSp: new Date()

        },
      });
     

      const token = jwt.sign({ userId: userId }, process.env.SECRET_KEY);

      res.status(200).json({ message: "Inscription réussie", token });
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
