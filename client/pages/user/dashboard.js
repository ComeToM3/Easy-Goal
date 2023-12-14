// user/dashboard.js

import { useEffect } from "react";
import { useRouter } from "next/router";
import ULayout from "@/components/userComponents/ULayout";

export default function UserDashboard({children}) {
  const router = useRouter();

  useEffect(() => {
   
    const token = localStorage.getItem("token"); 

    if (!token) {
      // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion
      router.push( "/");
    } else {

    }
  }, []);

  return (
    <>
      <ULayout>
        {/* Contenu de votre tableau de bord ici */}
        {children}
      </ULayout>
    </>
  );
}
