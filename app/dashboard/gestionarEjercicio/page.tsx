"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
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

interface Muscle {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscle: number;
  category: number;
  videoUrl: string;
  imageUrl: string;
}

export default function ExerciseManager() {
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [muscleNames, setMuscleNames] = useState<Muscle[]>([]);
  const [categoryNames, setCategoryNames] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/exercises/")
      .then((response) => setExerciseData(response.data))
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/muscles/")
      .then((response) => setMuscleNames(response.data))
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories/")
      .then((response) => setCategoryNames(response.data))
      .catch((error) => setError(error.message));
  }, []);

  const filteredExercises = exerciseData.filter(
    (exercise) =>
      (exercise.name &&
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exercise.description &&
        exercise.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (exercise.muscle &&
        exercise.muscle
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (exercise.category &&
        exercise.category
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const muscle = Number(formData.get("muscle"));
    const category = Number(formData.get("category"));
    const videoUrl = formData.get("videoUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (currentExercise) {
      const updatedExercise = {
        name,
        description,
        muscle,
        category,
        videoUrl,
        imageUrl,
      };

      try {
        await axios.put(
          `http://localhost:5000/exercises/${currentExercise.id}`,
          updatedExercise
        );

        setExerciseData((prevData) =>
          prevData.map((ex) =>
            ex.id === currentExercise.id ? { ...ex, ...updatedExercise } : ex
          )
        );
      } catch (error) {
        console.error("Error al editar el ejercicio:", error);
      }
    } else {
      const newExercise = {
        name,
        description,
        muscle,
        category,
        videoUrl,
        imageUrl,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/exercises/",
          newExercise
        );

        // Agregar el nuevo ejercicio al estado inmediatamente
        setExerciseData((prevData) => [...prevData, response.data]);
      } catch (error) {
        console.error("Error al crear el ejercicio:", error);
      }
    }

    setIsOpen(false);
    setCurrentExercise(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/exercises/${id}`);
      setExerciseData((prevData) => prevData.filter((ex) => ex.id !== id));
    } catch (error) {
      console.error("Error al eliminar el ejercicio:", error);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ejercicios</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

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
                type="text"
                defaultValue={currentExercise?.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                typeof="text"
                defaultValue={currentExercise?.description}
                required
              />
            </div>
            <div>
              <Label htmlFor="muscle">Músculo</Label>
              <Select
                name="muscle"
                defaultValue={currentExercise?.muscle.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un músculo" />
                </SelectTrigger>
                <SelectContent>
                  {muscleNames.map((muscle) => (
                    <SelectItem key={muscle.id} value={muscle.id.toString()}>
                      {muscle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                name="category"
                defaultValue={currentExercise?.category.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoryNames.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      <div className="mb-4 flex">
        <Input
          type="text"
          placeholder="Buscar ejercicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Músculo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>{exercise.name}</TableCell>
              <TableCell>{exercise.description}</TableCell>
              <TableCell>{exercise.muscle}</TableCell>
              <TableCell>{exercise.category}</TableCell>
              <TableCell>{exercise.videoUrl}</TableCell>
              <TableCell>{exercise.imageUrl}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() => handleEdit(exercise)}
                  className="mr-2"
                >
                  <Edit />
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleDelete(exercise.id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
