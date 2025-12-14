import { WordCategory } from "./types";

export const DEFAULT_CATEGORIES: WordCategory[] = [
  {
    id: 'default-animals',
    name: 'Animales (Inglés)',
    isCustom: false,
    words: ['Lion', 'Elephant', 'Giraffe', 'Penguin', 'Dolphin', 'Eagle', 'Snake', 'Kangaroo', 'Bear', 'Tiger']
  },
  {
    id: 'default-food',
    name: 'Comida (Español)',
    isCustom: false,
    words: ['Pizza', 'Hamburguesa', 'Ensalada', 'Paella', 'Tacos', 'Sushi', 'Helado', 'Manzana', 'Pan', 'Queso']
  },
  {
    id: 'default-house',
    name: 'Objetos de la Casa (Inglés)',
    isCustom: false,
    words: ['Sofa', 'Television', 'Bed', 'Fridge', 'Microwave', 'Lamp', 'Mirror', 'Shower', 'Table', 'Chair']
  },
  {
    id: 'default-jobs',
    name: 'Profesiones (Inglés)',
    isCustom: false,
    words: ['Doctor', 'Teacher', 'Firefighter', 'Artist', 'Programmer', 'Chef', 'Pilot', 'Nurse', 'Police Officer', 'Scientist']
  },
  {
    id: 'default-climate',
    name: 'Cambio Climático',
    isCustom: false,
    words: ['Calentamiento global', 'Efecto invernadero', 'Deshielo', 'Dióxido de carbono', 'Energías renovables', 'Reciclaje', 'Sequía', 'Contaminación', 'Capa de ozono', 'Sostenibilidad', 'Combustibles fósiles', 'Deforestación']
  },
  {
    id: 'default-electric',
    name: 'Circuito Eléctrico',
    isCustom: false,
    words: ['Batería', 'Cable', 'Interruptor', 'Bombilla', 'Resistencia', 'Voltaje', 'Corriente', 'Generador', 'Fusible', 'Motor', 'Pila', 'Conductor']
  },
  {
    id: 'default-safety',
    name: 'Seguridad Laboral',
    isCustom: false,
    words: ['Casco', 'Guantes', 'Extintor', 'Gafas de protección', 'Salida de emergencia', 'Riesgo', 'Accidente', 'Señalización', 'Chaleco reflectante', 'Primeros auxilios', 'Mascarilla', 'Arnés']
  }
];