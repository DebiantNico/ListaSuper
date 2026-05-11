export interface Product {
  id: string;
  name: string;
  priceStr: string; // Guardamos el texto para permitir escribir decimales fácilmente
  price: number;    // Precio numérico para la suma total
  quantity: number;
}

export interface StoreLists {
  [storeName: string]: Product[];
}