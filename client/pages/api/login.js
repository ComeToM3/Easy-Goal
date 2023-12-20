import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db }  from "../../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore/lite";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;


      // Récupérer l'utilisateur par e-mail depuis Firebase Firestore
      const usersCollection = collection(db, 'users');
      const usersQuery = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Récupérer les données de l'utilisateur
      let userData;
      querySnapshot.forEach(doc => {
        userData = doc.data();
      });

      // Comparer le mot de passe haché stocké avec celui fourni dans la requête
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // L'utilisateur est authentifié avec succès, générer le token JWT
      const token = jwt.sign({ userId: userData.id }, process.env.SECRET_KEY);

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}
