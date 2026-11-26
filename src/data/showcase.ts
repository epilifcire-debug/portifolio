// Vitrine de apps e automações. `image` fica vazio por enquanto:
// quando houver prints, coloque o arquivo em public/vitrine/ e o caminho aqui (ex.: "/vitrine/tecnica.png").
export type ShowcaseItem = {
  name: string;
  description: string;
  status?: "Em produção" | "Em migração";
  url?: string;
  image?: string;
};

export const showcaseApps: ShowcaseItem[] = [
  {
    name: "Técnica Gestão",
    description: "Gestão de obras da Técnica Engenharia. Visual preto e perolado, com portal do cliente.",
    status: "Em produção",
    url: "https://tecnica.efcsys.com",
  },
  {
    name: "Sistema PCD Eventos",
    description: "Cadastro e check-in de pessoas com deficiência em eventos.",
    status: "Em produção",
  },
  {
    name: "Gerenciamento de sistema de cortesias",
    description: "Gestão de cortesias por evento e setor, conferência, impressão, Excel e auditoria.",
    status: "Em migração",
  },
  {
    name: "GRF Controle Pessoal",
    description: "Efetivo de eventos da GRF Segurança.",
    status: "Em migração",
  },
  {
    name: "EVENTOID",
    description: "Controle de equipes temporárias em eventos por reconhecimento facial.",
    status: "Em migração",
  },
  {
    name: "Wine Barbell Club",
    description: "Gestão de studio fitness.",
    status: "Em produção",
    url: "https://winebarbellclub.efcsys.com/",
  },
  {
    name: "Agenda de Artistas",
    description: "Gestão dos eventos dos artistas, com página pública.",
    status: "Em produção",
  },
  {
    name: "Port Saint John",
    description: "Reservas de áreas de lazer do condomínio, com aviso pelo WhatsApp.",
    status: "Em produção",
  },
  {
    name: "Portaria EFCSYS",
    description:
      "Controle de encomendas e itens na portaria de condomínios, com retirada por assinatura e aviso por WhatsApp.",
    status: "Em produção",
  },
];

export const showcaseAutomations: ShowcaseItem[] = [
  {
    name: "bot.adm e bot.BI",
    description:
      "Coleta diária de relatórios em PDF e upload automático no sistema de BI, para análise de dados e vendas.",
  },
  {
    name: "Cadastro PCD",
    description: "Cadastro de PCD no credenciamento público a partir de planilha e pasta de fotos.",
  },
  {
    name: "Bot de gerenciamento de ingressos",
    description: "Cancelamento a partir de fotos dos ingressos, com fila de processamento.",
  },
  {
    name: "Monitor de lote",
    description: "Checagem da quantidade de vendas de um lote, a cada 5 minutos.",
  },
  { name: "PointBot", description: "Bot de WhatsApp em Node.js." },
  {
    name: "Robozinhos bots",
    description: "Equipe de programação com Chefe, PM, UI/UX, Código, Banco/SQL, Fluxos e Docs, em pixel art.",
  },
];
