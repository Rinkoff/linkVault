"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LinkData } from "@/components/LinkCard";

export const useLinks = (userId: string | undefined, activeTab: string) => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLinks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const linksRef = collection(db, "links");
    let q = query(
      linksRef,
      where("userId", "==", userId),
      where("type", "==", activeTab),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LinkData[];
      
      setLinks(fetchedLinks);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching links:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, activeTab]);

  const deleteLink = async (id: string) => {
    try {
      await deleteDoc(doc(db, "links", id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  return { links, loading, deleteLink };
};
