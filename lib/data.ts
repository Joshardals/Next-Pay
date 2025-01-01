interface NavLink {
  id: number;
  title: string;
  path: string;
}

export const FEATURES = [
  "Zero-fee recurring buys",
  "U.S. based human support",
  "Proven full reserve custody",
  "3.8% interest on cash savings",
];

export const navigationLinks: NavLink[] = [
  {
    id: 1,
    title: "Individuals",
    path: "#",
  },
  {
    id: 2,
    title: "Private Clients",
    path: "#",
  },
  {
    id: 3,
    title: "Businesses",
    path: "#",
  },
  {
    id: 4,
    title: "Learn",
    path: "#",
  },
  {
    id: 5,
    title: "About",
    path: "#",
  },
];
