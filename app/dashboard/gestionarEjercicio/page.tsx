"use client";

import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Exercise = {
  id: number;
  name: string;
  description: string;
  muscle: string;
  category: string;
  videoUrl: string;
  imageUrl: string;
};

// Simulated list of muscles from a database
const muscles = [
  "Pectorales",
  "Dorsales",
  "Deltoides",
  "Bíceps",
  "Tríceps",
  "Cuádriceps",
  "Isquiotibiales",
  "Gemelos",
  "Abdominales",
  "Glúteos",
];

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: "Sentadillas",
      description: "Ejercicio para piernas y glúteos",
      muscle: "Cuádriceps",
      category: "Fuerza",
      videoUrl: "",
      imageUrl: "",
    },
    {
      id: 2,
      name: "Flexiones",
      description: "Ejercicio para pecho y tríceps",
      muscle: "Pectorales",
      category: "Calistenia",
      videoUrl: "",
      imageUrl: "",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const muscle = formData.get("muscle") as string;
    const category = formData.get("category") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (currentExercise) {
      // Editar ejercicio existente
      setExercises(
        exercises.map((ex) =>
          ex.id === currentExercise.id
            ? { ...ex, name, description, muscle, category, videoUrl, imageUrl }
            : ex
        )
      );
    } else {
      // Crear nuevo ejercicio
      const newExercise: Exercise = {
        id: Math.max(0, ...exercises.map((e) => e.id)) + 1,
        name,
        description,
        muscle,
        category,
        videoUrl,
        imageUrl,
      };
      setExercises([...exercises, newExercise]);
    }
    setIsOpen(false);
    setCurrentExercise(null);
  };

  const handleEdit = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ejercicios</h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setCurrentExercise(null)}>
            <Plus className="mr-2 h-4 w-4" /> Crear Ejercicio
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentExercise ? "Editar Ejercicio" : "Crear Nuevo Ejercicio"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentExercise?.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={currentExercise?.description}
                required
              />
            </div>
            <div>
              <Label htmlFor="muscle">Músculo</Label>
              <Select
                name="muscle"
                defaultValue={currentExercise?.muscle || muscles[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un músculo" />
                </SelectTrigger>
                <SelectContent>
                  {muscles.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>
                      {muscle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                name="category"
                defaultValue={currentExercise?.category}
                required
              />
            </div>
            <div>
              <Label htmlFor="videoUrl">URL del Video</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                defaultValue={currentExercise?.videoUrl}
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL de la Imagen</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={currentExercise?.imageUrl}
              />
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-4 mb-4">
        <Input
          type="text"
          placeholder="Buscar ejercicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Músculo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>{exercise.name}</TableCell>
              <TableCell>{exercise.muscle}</TableCell>
              <TableCell>{exercise.category}</TableCell>
              <TableCell>{exercise.description}</TableCell>
              <TableCell>
                {exercise.videoUrl && (
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver video
                  </a>
                )}
              </TableCell>
              <TableCell>
                {exercise.imageUrl && (
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="w-10 h-10 object-cover"
                  />
                )}
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleEdit(exercise)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
