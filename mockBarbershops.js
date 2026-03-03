export const mockBarbershops = [
  {
    id: 1,
    name: "Barbearia Clássica Lisboa",
    description: "Uma barbearia tradicional no coração de Lisboa, oferecendo cortes clássicos e barbear à moda antiga com toalha quente.",
    location: {
      address: "Rua da Prata, 123",
      city: "Lisboa",
      district: "Lisboa",
      coordinates: [38.7115, -9.1370]
    },
    rating: 4.8,
    reviewCount: 156,
    isPremium: true,
    priceRange: "€€",
    logo: "https://images.unsplash.com/photo-1554841313-3ad511e72777",
    coverImage: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8",
    contacts: {
      phone: "+351 912 345 678",
      email: "info@barbeariaclassica.pt",
      instagram: "@barbeariaclassica",
      facebook: "barbeariaclassica",
      whatsapp: "+351 912 345 678"
    },
    hours: [
      { day: "Segunda", open: "09:00", close: "19:00" },
      { day: "Terça", open: "09:00", close: "19:00" },
      { day: "Quarta", open: "09:00", close: "19:00" },
      { day: "Quinta", open: "09:00", close: "19:00" },
      { day: "Sexta", open: "09:00", close: "20:00" },
      { day: "Sábado", open: "10:00", close: "18:00" },
      { day: "Domingo", open: "Fechado", close: "Fechado" }
    ],
    services: [
      { id: 1, name: "Corte de Cabelo", category: "Corte", price: 15, duration: 30 },
      { id: 2, name: "Barba Completa", category: "Barba", price: 12, duration: 30 },
      { id: 3, name: "Combo (Corte + Barba)", category: "Corte", price: 25, duration: 60 },
      { id: 4, name: "Tratamento Facial", category: "Tratamentos", price: 20, duration: 45 }
    ],
    gallery: [
      { id: 1, url: "https://images.unsplash.com/photo-1554841313-3ad511e72777", category: "Interior" },
      { id: 2, url: "https://images.unsplash.com/photo-1634929994806-0cfacaf366e9", category: "Portfolio" },
      { id: 3, url: "https://images.unsplash.com/photo-1571592039740-938fb540cfa5", category: "Portfolio" },
      { id: 4, url: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8", category: "Interior" },
      { id: 5, url: "https://images.unsplash.com/photo-1637332759216-ff98579065a8", category: "Portfolio" },
      { id: 6, url: "https://images.unsplash.com/photo-1695173122226-3a932002ab33", category: "Portfolio" }
    ],
    reviews: [
      { id: 1, author: "João Silva", rating: 5, comment: "Melhor corte de Lisboa!", date: "2024-01-15", response: "Obrigado João! Volte sempre." },
      { id: 2, author: "Pedro Santos", rating: 4, comment: "Bom serviço, mas a espera foi um pouco longa.", date: "2024-01-10", response: null },
      { id: 3, author: "Miguel Costa", rating: 5, comment: "Profissionais incríveis e ambiente top.", date: "2023-12-28", response: null }
    ]
  },
  {
    id: 2,
    name: "BarberShop Porto",
    description: "Estilo moderno e urbano no Porto. Especialistas em fades e designs modernos.",
    location: {
      address: "Avenida dos Aliados, 45",
      city: "Porto",
      district: "Porto",
      coordinates: [41.1496, -8.6109]
    },
    rating: 4.6,
    reviewCount: 98,
    isPremium: false,
    priceRange: "€",
    logo: "https://images.unsplash.com/photo-1571592039740-938fb540cfa5",
    coverImage: "https://images.unsplash.com/photo-1634929994806-0cfacaf366e9",
    contacts: {
      phone: "+351 923 456 789",
      email: "porto@barbershop.pt",
      instagram: "@barbershopporto",
      facebook: "barbershopporto",
      whatsapp: "+351 923 456 789"
    },
    hours: [
      { day: "Segunda", open: "10:00", close: "20:00" },
      { day: "Terça", open: "10:00", close: "20:00" },
      { day: "Quarta", open: "10:00", close: "20:00" },
      { day: "Quinta", open: "10:00", close: "20:00" },
      { day: "Sexta", open: "10:00", close: "22:00" },
      { day: "Sábado", open: "10:00", close: "22:00" },
      { day: "Domingo", open: "Fechado", close: "Fechado" }
    ],
    services: [
      { id: 1, name: "Fade Cut", category: "Corte", price: 12, duration: 40 },
      { id: 2, name: "Design de Barba", category: "Barba", price: 10, duration: 25 },
      { id: 3, name: "Coloração", category: "Outros", price: 30, duration: 90 }
    ],
    gallery: [
      { id: 1, url: "https://images.unsplash.com/photo-1571592039740-938fb540cfa5", category: "Interior" },
      { id: 2, url: "https://images.unsplash.com/photo-1637332759216-ff98579065a8", category: "Portfolio" }
    ],
    reviews: [
      { id: 1, author: "Rui Almeida", rating: 5, comment: "Fade perfeito!", date: "2024-02-01", response: null },
      { id: 2, author: "Tiago Mendes", rating: 4, comment: "Ambiente muito cool.", date: "2024-01-20", response: null }
    ]
  },
  {
    id: 3,
    name: "Elite Cuts Coimbra",
    description: "Experiência premium de barbearia em Coimbra.",
    location: {
      address: "Rua Ferreira Borges, 10",
      city: "Coimbra",
      district: "Coimbra",
      coordinates: [40.2033, -8.4103]
    },
    rating: 4.9,
    reviewCount: 42,
    isPremium: true,
    priceRange: "€€€",
    logo: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8",
    coverImage: "https://images.unsplash.com/photo-1695173122226-3a932002ab33",
    contacts: {
      phone: "+351 934 567 890",
      email: "contact@elitecuts.pt",
      instagram: "@elitecutscoimbra",
      facebook: "elitecutscoimbra",
      whatsapp: "+351 934 567 890"
    },
    hours: [
      { day: "Segunda", open: "09:00", close: "18:00" },
      { day: "Terça", open: "09:00", close: "18:00" },
      { day: "Quarta", open: "09:00", close: "18:00" },
      { day: "Quinta", open: "09:00", close: "18:00" },
      { day: "Sexta", open: "09:00", close: "19:00" },
      { day: "Sábado", open: "09:00", close: "13:00" },
      { day: "Domingo", open: "Fechado", close: "Fechado" }
    ],
    services: [
      { id: 1, name: "Corte Executivo", category: "Corte", price: 20, duration: 45 },
      { id: 2, name: "Ritual de Barba", category: "Barba", price: 18, duration: 40 },
      { id: 3, name: "Massagem Capilar", category: "Tratamentos", price: 15, duration: 20 }
    ],
    gallery: [
      { id: 1, url: "https://images.unsplash.com/photo-1695173122226-3a932002ab33", category: "Portfolio" }
    ],
    reviews: [
      { id: 1, author: "André Gomes", rating: 5, comment: "Serviço de luxo.", date: "2024-01-30", response: "Agradecemos a preferência, André!" }
    ]
  }
];