"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipo para los ejercicios
type Ejercicio = {
  id: string;
  nombre: string;
  musculo: string;
  categoria: string;
  descripcion: string;
  video: string;
  imagen: string;
};

// Esta función simula una llamada a la API para obtener los ejercicios
const obtenerEjercicios = async (): Promise<Ejercicio[]> => {
  // Simula un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Aquí normalmente harías una llamada fetch a tu API
  return [
    {
      id: "1",
      nombre: "Sentadillas",
      musculo: "Piernas",
      categoria: "Fuerza",
      descripcion: "Ejercicio para fortalecer piernas y glúteos",
      video: "url_del_video_sentadillas",
      imagen: "url_de_la_imagen_sentadillas",
    },
    {
      id: "2",
      nombre: "Flexiones",
      musculo: "Pecho",
      categoria: "Resistencia",
      descripcion: "Ejercicio para fortalecer pecho y brazos",
      video: "url_del_video_flexiones",
      imagen: "url_de_la_imagen_flexiones",
    },
    {
      id: "3",
      nombre: "Curl de Bíceps",
      musculo: "Brazos",
      categoria: "Fuerza",
      descripcion: "Ejercicio para fortalecer los bíceps",
      video: "url_del_video_curl_biceps",
      imagen: "url_de_la_imagen_curl_biceps",
    },
    {
      id: "4",
      nombre: "Press de Banca",
      musculo: "Pecho",
      categoria: "Fuerza",
      descripcion: "Ejercicio para desarrollar el pecho y tríceps",
      video:
        "https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.mp4#t=0.1",
      imagen: "url_de_la_imagen_press_banca",
    },
    // Añade más ejercicios aquí si lo deseas
  ];
};
export default function Page() {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState<
    Ejercicio[]
  >([]);
  const [todosLosEjercicios, setTodosLosEjercicios] = useState<Ejercicio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarEjercicios = async () => {
      try {
        const ejercicios = await obtenerEjercicios();
        setTodosLosEjercicios(ejercicios);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar los ejercicios:", error);
        setCargando(false);
      }
    };

    cargarEjercicios();
  }, []);

  const musculos = [...new Set(todosLosEjercicios.map((e) => e.musculo))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la rutina
    console.log({ nombre, nivel, tipo, descripcion, ejerciciosSeleccionados });
  };

  const agregarEjercicio = (ejercicio: Ejercicio) => {
    if (!ejerciciosSeleccionados.some((e) => e.id === ejercicio.id)) {
      setEjerciciosSeleccionados([...ejerciciosSeleccionados, ejercicio]);
    }
  };

  const eliminarEjercicio = (ejercicioId: string) => {
    setEjerciciosSeleccionados(
      ejerciciosSeleccionados.filter((e) => e.id !== ejercicioId)
    );
  };

  if (cargando) {
    return <div className="text-center p-4">Cargando ejercicios...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Rutina</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre de la Rutina</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="nivel">Nivel</Label>
          <Select onValueChange={setNivel} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="principiante">Principiante</SelectItem>
              <SelectItem value="intermedio">Intermedio</SelectItem>
              <SelectItem value="avanzado">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tipo">Tipo de Rutina</Label>
          <Select onValueChange={setTipo} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fuerza">Fuerza</SelectItem>
              <SelectItem value="resistencia">Resistencia</SelectItem>
              <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Seleccionar Ejercicios:</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <Accordion type="multiple" className="w-full">
              {musculos.map((musculo) => (
                <AccordionItem key={musculo} value={musculo}>
                  <AccordionTrigger>{musculo}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {todosLosEjercicios
                        .filter((ejercicio) => ejercicio.musculo === musculo)
                        .map((ejercicio) => (
                          <Button
                            key={ejercicio.id}
                            variant="outline"
                            className="justify-start"
                            onClick={() => agregarEjercicio(ejercicio)}
                          >
                            {ejercicio.nombre}
                          </Button>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Ejercicios Seleccionados:</h3>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ejerciciosSeleccionados.map((ejercicio) => (
                <Card key={ejercicio.id}>
                  <CardHeader>
                    <CardTitle>{ejercicio.nombre}</CardTitle>
                    <CardDescription>
                      {ejercicio.musculo} - {ejercicio.categoria}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{ejercicio.descripcion}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      onClick={() => eliminarEjercicio(ejercicio.id)}
                    >
                      Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Button type="submit">Crear Rutina</Button>
      </form>
    </div>
  );
}
