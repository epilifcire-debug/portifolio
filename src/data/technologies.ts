export type Tech = { name: string; description: string };

export const techGroups: { title: string; items: Tech[] }[] = [
  {
    title: "Front-end",
    items: [
      { name: "JavaScript", description: "Linguagem base das interfaces e da lógica do cliente." },
      { name: "React", description: "Construção de interfaces componentizadas e reativas." },
      { name: "HTML", description: "Estrutura semântica e acessível das páginas." },
      { name: "CSS", description: "Estilos, layout e responsividade." },
      { name: "Tailwind CSS", description: "Design system utilitário e consistente." },
    ],
  },
  {
    title: "Back-end",
    items: [
      { name: "Node.js", description: "Execução do servidor e da lógica de negócio." },
      { name: "Express", description: "Criação de rotas e APIs REST." },
    ],
  },
  {
    title: "Banco de dados",
    items: [
      { name: "MongoDB", description: "Banco de dados orientado a documentos." },
      { name: "Supabase", description: "Banco relacional, autenticação e storage." },
    ],
  },
  {
    title: "Integrações",
    items: [
      { name: "Google Calendar API", description: "Sincronização de agendas e eventos." },
      { name: "Cloudinary", description: "Armazenamento e entrega de imagens." },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { name: "Git", description: "Versionamento do código." },
      { name: "GitHub", description: "Hospedagem dos repositórios e colaboração." },
      { name: "Chart.js", description: "Gráficos e visualização de dados." },
      { name: "jsPDF", description: "Geração de documentos em PDF." },
      { name: "PWA", description: "Aplicações instaláveis com suporte offline." },
    ],
  },
];

export const mainTech = [
  "React",
  "JavaScript",
  "Node.js",
  "MongoDB",
  "Supabase",
  "PWA",
  "Google Calendar API",
];
