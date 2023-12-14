import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const user = await prisma.User.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);


      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
