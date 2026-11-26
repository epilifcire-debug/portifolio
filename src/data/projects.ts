export type Project = {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  short: string;
  description: string;
  technologies: string[];
  features: string[];
  challenge: string;
  solution: string;
  gallery: { caption: string }[];
  demoUrl?: string;
  githubUrl?: string;
};

export const categories = [
  "Todos",
  "Gestão",
  "Eventos",
  "Fitness",
  "Agendamento",
  "Produtividade",
  "Finanças",
] as const;

export const projects: Project[] = [
  {
    slug: "app-barbearia",
    name: "App de Agendamento para Barbearia",
    category: "Agendamento",
    tags: ["Agendamento", "Gestão"],
    short: "Sistema de agendamento para barbearias com serviços, horários e profissionais.",
    description:
      "Aplicativo de agendamento para barbearias, com cadastro de serviços, controle de horários e organização dos atendimentos.",
    technologies: ["React", "Node.js", "MongoDB", "PWA"],
    features: ["Agenda de horários", "Cadastro de serviços", "Gestão de clientes", "PWA instalável"],
    challenge:
      "Barbearias organizam atendimentos por mensagens e anotações manuais, o que gera horários duplicados e falhas de comunicação.",
    solution:
      "Um aplicativo com agenda centralizada, cadastro de serviços e visualização clara dos horários disponíveis.",
    gallery: [{ caption: "Agenda" }, { caption: "Serviços" }, { caption: "Clientes" }],
  },
  {
    slug: "agenda-de-artistas",
    name: "Agenda de Artistas",
    category: "Gestão",
    tags: ["Gestão", "Eventos"],
    short: "Plataforma para gerenciamento e consulta da agenda de artistas.",
    description:
      "Plataforma para gerenciamento e consulta da agenda de artistas e eventos, com datas, horários, cidades e apresentações.",
    technologies: ["React", "Node.js", "MongoDB", "Google Calendar API", "PWA"],
    features: [
      "Cadastro de artistas e equipe",
      "Agenda de shows e eventos",
      "Sincronização com Google Calendar",
      "Consulta visual mensal",
      "Perfis públicos dos artistas",
      "PWA instalável",
    ],
    challenge:
      "Artistas e equipes ainda gerenciam suas agendas de shows de forma manual, usando planilhas ou anotações, o que causa erros, conflitos de datas e falta de organização.",
    solution:
      "Um sistema completo para centralizar agendas, organizar com o Google Calendar e facilitar o acesso às informações de shows e eventos.",
    gallery: [{ caption: "Agenda mensal" }, { caption: "Cadastro de artista" }, { caption: "Eventos" }],
  },
  {
    slug: "lpo-studio-hibrido",
    name: "Híbrido / LPO Studio",
    category: "Fitness",
    tags: ["Fitness", "Gestão"],
    short: "Aplicativo para gerenciamento de alunos, treinos, conteúdos e modalidades.",
    description:
      "Aplicativo para gerenciamento de alunos, treinos, conteúdos e modalidades de um estúdio de treinamento.",
    technologies: ["React", "Node.js", "MongoDB", "PWA"],
    features: ["Gestão de alunos", "Montagem de treinos", "Vídeos e conteúdos", "Modalidades"],
    challenge:
      "O acompanhamento de alunos e treinos era feito fora de um sistema próprio, dificultando o controle das modalidades e conteúdos.",
    solution:
      "Um aplicativo único para cadastrar alunos, distribuir treinos e organizar conteúdos por modalidade.",
    gallery: [{ caption: "Treinos" }, { caption: "Alunos" }, { caption: "Conteúdos" }],
  },
  {
    slug: "cadastro-de-cortesias",
    name: "Cadastro de Cortesias",
    category: "Eventos",
    tags: ["Eventos", "Gestão"],
    short: "Sistema para cadastro e controle de cortesias em eventos.",
    description:
      "Sistema para cadastro e controle de listas de cortesias em eventos, com organização por evento e responsável.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: ["Cadastro de cortesias", "Listas por evento", "Controle de responsáveis", "Exportação de listas"],
    challenge:
      "As listas de cortesias eram controladas em planilhas separadas, gerando retrabalho e divergências na portaria dos eventos.",
    solution:
      "Um cadastro centralizado, com listas organizadas por evento e consulta rápida no dia do evento.",
    gallery: [{ caption: "Listas" }, { caption: "Cadastro" }, { caption: "Consulta" }],
  },
  {
    slug: "pcd-eventos",
    name: "PCD Eventos",
    category: "Eventos",
    tags: ["Eventos", "Gestão"],
    short: "Sistema voltado ao atendimento e organização de acessibilidade em eventos.",
    description:
      "Sistema voltado ao atendimento e à organização de acessibilidade para pessoas com deficiência em eventos.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: ["Cadastro de solicitações", "Organização por evento", "Controle de atendimento"],
    challenge:
      "As solicitações de acessibilidade chegavam por canais diferentes, dificultando o atendimento organizado durante o evento.",
    solution:
      "Um sistema para receber, organizar e acompanhar as solicitações de acessibilidade em um só lugar.",
    gallery: [{ caption: "Solicitações" }, { caption: "Eventos" }, { caption: "Atendimento" }],
  },
  {
    slug: "controle-financeiro",
    name: "Controle Financeiro",
    category: "Finanças",
    tags: ["Finanças", "Gestão"],
    short: "Aplicativo para organização e acompanhamento das finanças.",
    description:
      "Aplicativo para organização e acompanhamento das finanças, com lançamentos, categorias e visualização em gráficos.",
    technologies: ["React", "Chart.js", "MongoDB", "PWA"],
    features: ["Lançamentos", "Categorias", "Dashboard", "Gráficos"],
    challenge:
      "Acompanhar entradas e saídas em planilhas dificulta enxergar o resultado real do mês.",
    solution:
      "Um painel com lançamentos categorizados e gráficos que mostram a evolução financeira.",
    gallery: [{ caption: "Dashboard" }, { caption: "Lançamentos" }, { caption: "Gráficos" }],
  },
  {
    slug: "studytimer",
    name: "StudyTimer",
    category: "Produtividade",
    tags: ["Produtividade"],
    short: "Aplicativo para organizar sessões de estudo e acompanhar o tempo dedicado.",
    description:
      "Aplicativo de produtividade para organizar sessões de estudo, controlar o tempo e acompanhar o progresso.",
    technologies: ["React", "PWA"],
    features: ["Timer de estudo", "Sessões e pausas", "Histórico de tempo", "PWA instalável"],
    challenge: "Manter constância nos estudos exige controle de tempo e registro do que já foi feito.",
    solution: "Um timer simples com registro das sessões e acompanhamento do tempo dedicado.",
    gallery: [{ caption: "Timer" }, { caption: "Sessões" }, { caption: "Histórico" }],
  },
  {
    slug: "maquinetas",
    name: "Maquinetas",
    category: "Gestão",
    tags: ["Gestão", "Finanças"],
    short: "Sistema para controle e organização de maquinetas de pagamento.",
    description:
      "Sistema para controle e organização de maquinetas de pagamento, com registro de uso e responsáveis.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: ["Cadastro de maquinetas", "Controle de responsáveis", "Registro de uso"],
    challenge:
      "O controle de quais maquinetas estavam em uso e com quem era feito manualmente.",
    solution: "Um cadastro digital com registro de uso e responsáveis por equipamento.",
    gallery: [{ caption: "Equipamentos" }, { caption: "Registros" }, { caption: "Responsáveis" }],
  },
  {
    slug: "port-saint-john",
    name: "Port Saint John",
    category: "Gestão",
    tags: ["Gestão", "Eventos"],
    short: "Sistema desenvolvido para gestão e organização de reservas.",
    description:
      "Sistema desenvolvido para gestão e organização de reservas e informações do Port Saint John.",
    technologies: ["React", "Node.js", "MongoDB"],
    features: ["Reservas", "Gestão de informações", "Painel administrativo"],
    challenge: "A organização das reservas e informações dependia de controles manuais.",
    solution: "Um painel único para registrar reservas e consultar informações rapidamente.",
    gallery: [{ caption: "Reservas" }, { caption: "Painel" }, { caption: "Detalhes" }],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const relatedProjects = (slug: string, count = 3) =>
  projects.filter((p) => p.slug !== slug).slice(0, count);
