//main/pages/api/signup.js

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { db }  from "../../lib/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore/lite";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userPrenom, userNom, userEmail, userPassword } = req.body;


      // Vérifier si l'email existe déjà dans la base de données Firebase
      const usersCollection = collection(db, 'users');
      const emailQuery = query(usersCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const userId = uuidv4();

      const hashedPassword = await bcrypt.hash(userPassword, 10);

      await addDoc(collection(db, 'users'), {
        id: userId.toString(),
        prenom: userPrenom,
        nom: userNom,
        email: userEmail.toString(),
        password: hashedPassword.toString(),
        timeSp: new Date()
      });
     

      const token = jwt.sign({ userId: userId }, process.env.SECRET_KEY);

      res.status(200).json({ message: "Inscription réussie", token });
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
