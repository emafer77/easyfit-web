"use client";
import { useState, ChangeEvent, FormEvent } from "react";

// Tipado para los datos del formulario
interface FormData {
  name: string;
  description: string;
  muscle: number;
  category: number;
  videoUrl: string;
  imageUrl: string;
}

const Formulario = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    muscle: 1,
    category: 1,
    videoUrl: "",
    imageUrl: "",
  });

  // Maneja el cambio de los campos del formulario
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    

    try {
      const response = await fetch("http://localhost:5000/exercises/", {
        // Asegúrate de usar la URL de tu API FastAPI
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convierte el objeto a JSON
      });

      const result = await response.json();
      console.log("Éxito:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="muscle"
        value={formData.muscle}
        onChange={handleChange}
        min="1"
        required
      />
      <input
        type="number"
        name="category"
        value={formData.category}
        onChange={handleChange}
        min="1"
        required
      />
      <input
        type="text"
        name="videoUrl"
        value={formData.videoUrl}
        onChange={handleChange}
        placeholder="Video URL"
        required
      />
      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        required
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;
