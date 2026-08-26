export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: "food" | "interior" | "chefs" | "drinks";
};

export const galleryItems: GalleryItem[] = [
  { id: "g1", src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&auto=format&q=85", alt: "Restaurant Ambiance", category: "interior" },
  { id: "g2", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=85", alt: "Dry-Aged Ribeye", category: "food" },
  { id: "g3", src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&h=700&fit=crop&auto=format&q=85", alt: "Chocolate Lava Cake", category: "food" },
  { id: "g4", src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=1100&fit=crop&auto=format&q=85", alt: "BBQ Ribs", category: "food" },
  { id: "g5", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&auto=format&q=85", alt: "Dining Room", category: "interior" },
  { id: "g6", src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&h=700&fit=crop&auto=format&q=85", alt: "Chef Plating", category: "chefs" },
  { id: "g7", src: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&h=1000&fit=crop&auto=format&q=85", alt: "Margherita Pizza", category: "food" },
  { id: "g8", src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&auto=format&q=85", alt: "Wagyu Burger", category: "food" },
  { id: "g9", src: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=700&h=700&fit=crop&auto=format&q=85", alt: "Signature Cocktail", category: "drinks" },
  { id: "g10", src: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&h=1000&fit=crop&auto=format&q=85", alt: "Peking Duck", category: "food" },
  { id: "g11", src: "https://images.unsplash.com/photo-1550966871-3ed6593773e5?w=800&h=600&fit=crop&auto=format&q=85", alt: "Chef Cooking", category: "chefs" },
  { id: "g12", src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=700&h=700&fit=crop&auto=format&q=85", alt: "Tiramisu", category: "food" },
  { id: "g13", src: "https://images.unsplash.com/photo-1546964124-0cce460949c5?w=800&h=1100&fit=crop&auto=format&q=85", alt: "Filet Mignon", category: "food" },
  { id: "g14", src: "https://images.unsplash.com/photo-1553979459-d02b1cfac37f?w=800&h=600&fit=crop&auto=format&q=85", alt: "Gourmet Burger", category: "food" },
  { id: "g15", src: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&h=700&fit=crop&auto=format&q=85", alt: "Mango Smoothie", category: "drinks" },
];

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "interior", label: "Interior" },
  { id: "chefs", label: "Our Chefs" },
  { id: "drinks", label: "Drinks" },
] as const;
