import Layout from "@/components/visitorComponents/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
   
    const token = localStorage.getItem("token"); 

    if (token) {
      // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion
      router.push( "/user/dashboard");
    } else {

    }
  }, []);

 
  return (
    <>
     <Layout>
    </Layout>      
    </>
  );
}
