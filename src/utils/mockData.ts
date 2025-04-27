// Mock assignee type definition
export interface Assignee {
  id: string;
  email: string;
  name: string;
}

// Mockup of assignees that can be reused across the application
export const mockAssignees: Assignee[] = [
  {
    id: "usrKYbgmgmGvjwXXO",
    email: "patrik.vulinec46@gmail.com",
    name: "Patrik Vulinec",
  },
  {
    id: "usr09kXVio3Pc0QYY",
    email: "mharalovic11@gmail.com",
    name: "Marko Haralović",
  },
];

export const tournamentItems = [
  {
    image: "/natjecanja/maraton.png",
    category: "Trčanje",
    title: "Zagrebački Maraton",
    time: "18:30",
    date: "11.9.2025",
    location: "Trg bana Josipa Jelačića",
  },
  {
    image: "/natjecanja/sah.png",
    category: "Šah",
    title: "Zagrebački Classic",
    time: "18:30",
    date: "11.9.2025",
    location: "Masarykova 11",
  },
  {
    image: "/natjecanja/strelicarstvo.png",
    category: "Streličarstvo",
    title: "CEC-Archery",
    time: "18:30",
    date: "11.9.2025",
    location: "Medvedgrad",
  },
  {
    image: "/natjecanja/veslanje.png",
    category: "Veslanje",
    title: "Veslačko prvenstvo",
    time: "18:30",
    date: "11.9.2025",
    location: "Veslački klub Jarun",
  },
  {
    image: "/natjecanja/judo.png",
    category: "Judo",
    title: "UniSport Zagreb judo",
    time: "10:30",
    date: "11.9.2025",
    location: "Osnovna škola Središće",
  },
  {
    image: "/natjecanja/triatlon.png",
    category: "Triatlon",
    title: "Trogir Outdoor Festival",
    time: "18:30",
    date: "11.9.2025",
    location: "Trogir",
  },
];
