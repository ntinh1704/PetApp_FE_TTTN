import React, { createContext, useContext, useState } from "react";
import { Pet } from "../models/pet";

type PetsContextType = {
  pets: Pet[];
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  removePet: (id: string) => void;
};

const PetsContext = createContext<PetsContextType | null>(null);

export const PetsProvider = ({ children }: { children: React.ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Bella",
      breed: "",
      gender: "",
      age: "",
      color: "",
      height: "",
      weight: "",
      image: null,
    },
  ]);

  const addPet = (pet: Pet) => {
    setPets((prev) => [...prev, pet]);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets((prev) =>
      prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)),
    );
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PetsContext.Provider value={{ pets, addPet, updatePet, removePet }}>
      {children}
    </PetsContext.Provider>
  );
};

export const usePets = () => {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error("usePets must be used inside PetsProvider");
  return ctx;
};
