import { Autor } from "./autor";
import { Libro } from "./libro";

export interface Libroconautor{
    libro: Libro;
    autor: Autor | null;
}