export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  dish: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Emily Richardson",
    role: "Food Blogger & Critic",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "Hot & Spice has completely redefined what I expect from a restaurant. Chef Marco's ribeye is the single best steak I've eaten in this city — maybe anywhere. The 45-day dry-aging speaks for itself. Impeccable service, stunning atmosphere. A must-visit.",
    date: "2025-12-15",
    dish: "Dry-Aged Ribeye",
  },
  {
    id: "t2",
    name: "David Okafor",
    role: "Business Executive",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "We host all our client dinners at Hot & Spice. The private dining room is flawless, the sommelier's wine pairings are spot-on, and the BBQ platter for our last anniversary celebration was absolutely jaw-dropping. Every guest leaves talking about it.",
    date: "2025-11-28",
    dish: "BBQ Mixed Platter",
  },
  {
    id: "t3",
    name: "Priya Sharma",
    role: "Wedding Planner",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "I've recommended Hot & Spice to 30+ couples for rehearsal dinners. Chef Amara's dim sum is extraordinary — each piece is a tiny work of art. The reservation system is seamless, staff are incredibly attentive, and the ambiance is naturally romantic.",
    date: "2025-11-10",
    dish: "Dim Sum Basket",
  },
  {
    id: "t4",
    name: "Carlos Mendez",
    role: "Culinary Instructor",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "As someone who teaches cooking for a living, I am incredibly hard to impress. Hot & Spice impresses me every time. The Peking Duck tableside service is theatrical and delicious in equal measure. Sophie's crème brûlée is textbook perfect — I used it as a teaching example.",
    date: "2025-10-22",
    dish: "Peking Duck",
  },
  {
    id: "t5",
    name: "Sarah & Tom Mitchell",
    role: "Anniversary Couple",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "Our 10th anniversary dinner was everything we dreamed of. They surprised us with a custom dessert with our names in chocolate — we literally cried. The Royal Signature Cocktail is something we still talk about months later. Already booked our 11th anniversary!",
    date: "2025-10-05",
    dish: "Tasting Menu",
  },
  {
    id: "t6",
    name: "James Whitfield",
    role: "Gourmet Travel Writer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&q=80",
    rating: 5,
    comment:
      "I've dined at Michelin-starred restaurants across four continents. Hot & Spice belongs in that conversation. The smoked brisket rivals anything from Austin's best pits. The sommelier's natural wine list is adventurous and thoughtfully curated. Worth the trip.",
    date: "2025-09-18",
    dish: "Texas Beef Brisket",
  },
];
