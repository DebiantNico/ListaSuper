import { Product } from './types';

export const CANASTA_BASICA: Product[] = [
  { id: '1', name: 'Tortillas de Maíz (1kg)', priceStr: '22', price: 22, quantity: 1 },
  { id: '2', name: 'Frijol Pinto (1kg)', priceStr: '38', price: 38, quantity: 1 },
  { id: '3', name: 'Arroz Blanco (1kg)', priceStr: '26', price: 26, quantity: 1 },
  { id: '4', name: 'Huevo Blanco (18 pzas)', priceStr: '52', price: 52, quantity: 1 },
  { id: '5', name: 'Leche Entera (1L)', priceStr: '25', price: 25, quantity: 1 },
  { id: '6', name: 'Aceite Vegetal (900ml)', priceStr: '35', price: 35, quantity: 1 },
  { id: '7', name: 'Jitomate Saladet (1kg)', priceStr: '28', price: 28, quantity: 1 },
  { id: '8', name: 'Cebolla Blanca (1kg)', priceStr: '20', price: 20, quantity: 1 },
  { id: '9', name: 'Chile Serrano (500g)', priceStr: '25', price: 25, quantity: 1 },
  { id: '10', name: 'Jabón de barra Zote', priceStr: '15', price: 15, quantity: 1 },
];

export const STORES = [
  { name: 'Walmart', color: '#0071CE' },
  { name: 'Bodega Aurrerá', color: '#00843D' },
  { name: 'Costco', color: '#E31837' },
  { name: 'Sam\'s Club', color: '#004B87' },
  { name: 'Tiendas 3B', color: '#E21B23' },
];

export const getDefaultStoreLists = () => {
  const initialLists: { [key: string]: Product[] } = {};
  STORES.forEach(store => {
    // Creamos una copia profunda para que cada tienda tenga su propia base independiente
    initialLists[store.name] = CANASTA_BASICA.map(item => ({ ...item }));
  });
  return initialLists;
};