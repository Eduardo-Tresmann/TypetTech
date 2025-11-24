# TypeTech

TypeTech é uma aplicação web moderna de teste de digitação (typing test) com funcionalidades sociais integradas. Desenvolvido com Next.js e Supabase, oferece uma experiência completa para usuários melhorarem suas habilidades de digitação enquanto competem com amigos e acompanham suas estatísticas.

## 🎯 O que o projeto faz

TypeTech permite que usuários:

- **Teste suas habilidades de digitação** em diferentes modos de tempo (15s, 30s, 60s, 120s)
- **Escolha níveis de dificuldade** (fácil, médio, difícil) para personalizar o desafio
- **Personalize a experiência** com múltiplos temas visuais (dark, light, monokai, ocean, forest)
- **Acompanhe seu progresso** com estatísticas detalhadas e recordes pessoais
- **Conecte-se com amigos** através de um sistema de amizades e convites
- **Converse em tempo real** com mensagens diretas
- **Compita em leaderboards** e veja como está em relação a outros usuários
- **Receba notificações** sobre novos recordes, mensagens e solicitações de amizade

## 🚀 Como instalar

### Pré-requisitos

- Node.js 18 ou superior
- npm (incluído com Node.js)
- Conta no Supabase (para banco de dados e autenticação)
- Git

### Passos de instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd TypeTech
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
   
   > **Nota:** Você pode obter essas credenciais no painel do seu projeto Supabase em Settings > API.

4. **Configure o banco de dados:**
   
   Execute os scripts SQL na pasta `supabase/` na ordem especificada no arquivo `supabase/README.md`. Esses scripts configuram:
   - Tabelas de perfis, amigos, mensagens e resultados
   - Políticas de segurança (RLS)
   - Triggers e funções auxiliares
   - Storage para avatares

## ▶️ Como rodar

### Modo de desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Build de produção

Para criar uma build otimizada para produção:

```bash
npm run build
```

### Iniciar servidor de produção

Após criar o build, inicie o servidor de produção:

```bash
npm start
```

### Outros comandos úteis

- **Linting:** `npm run lint` - Verifica problemas de código
- **Linting (auto-fix):** `npm run lint:fix` - Corrige automaticamente problemas de lint
- **Formatação:** `npm run format` - Formata o código com Prettier
- **Verificar formatação:** `npm run format:check` - Verifica se o código está formatado
- **Auditoria de segurança:** `npm run audit` - Verifica vulnerabilidades nas dependências

## 🧪 Como rodar testes

Atualmente, o projeto não possui uma suíte de testes automatizados configurada. Testes manuais podem ser realizados através da interface do aplicativo.

> **Nota:** A implementação de testes automatizados está planejada para futuras versões do projeto.

## 🛠️ Tecnologias usadas

### Frontend
- **[Next.js 16.0.3](https://nextjs.org/)** - Framework React com App Router
- **[React 19.2.0](https://react.dev/)** - Biblioteca para construção de interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### Backend & Banco de Dados
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - Storage para avatares
  - Row Level Security (RLS)

### Bibliotecas Adicionais
- **[react-easy-crop](https://github.com/ValentinH/react-easy-crop)** - Editor de imagens para avatares
- **[@supabase/supabase-js](https://github.com/supabase/supabase-js)** - Cliente JavaScript do Supabase

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **npm** - Gerenciador de pacotes

## 📊 Badges do CI

<!-- Badges serão adicionados quando o CI/CD for configurado -->
<!-- Exemplo:
[![CI](https://github.com/usuario/typetech/workflows/CI/badge.svg)](https://github.com/usuario/typetech/actions)
[![Build Status](https://github.com/usuario/typetech/workflows/Build/badge.svg)](https://github.com/usuario/typetech/actions)
-->

## 📁 Estrutura do projeto

```
TypeTech/
├── src/
│   ├── app/              # Páginas e rotas (Next.js App Router)
│   │   ├── auth/         # Autenticação (login, registro)
│   │   ├── friends/      # Sistema de amigos
│   │   ├── home/         # Página principal do jogo
│   │   ├── leaderboards/ # Rankings
│   │   ├── profile/      # Perfil do usuário
│   │   ├── settings/     # Configurações
│   │   └── stats/        # Estatísticas
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── auth/         # Componentes de autenticação
│   │   ├── chat/         # Componentes de chat
│   │   ├── friends/      # Componentes de amigos
│   │   ├── game/         # Componentes do jogo
│   │   ├── layout/       # Componentes de layout
│   │   ├── notifications/# Componentes de notificações
│   │   ├── profile/      # Componentes de perfil
│   │   └── ui/           # Componentes de UI genéricos
│   ├── constants/        # Constantes e dados estáticos
│   ├── context/          # Contextos React (Auth, GameConfig)
│   ├── core/             # Lógica de negócio central
│   │   ├── factories/    # Padrão Factory
│   │   ├── services/     # Serviços (Game, Sound, Theme)
│   │   ├── strategies/   # Padrão Strategy (dificuldades)
│   │   └── types.ts      # Tipos TypeScript principais
│   ├── hooks/            # Hooks customizados
│   ├── lib/              # Bibliotecas e utilitários
│   ├── services/         # Serviços de domínio (Avatar, Friend, Profile, User)
│   ├── styles/           # Estilos globais
│   └── utils/            # Funções utilitárias
├── supabase/             # Scripts SQL do banco de dados
├── docs/                 # Documentação adicional
├── package.json          # Dependências e scripts
└── README.md             # Este arquivo
```

## 🔐 Variáveis de ambiente

O projeto requer as seguintes variáveis de ambiente (definidas em `.env.local`):

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Sim |

> **Importante:** Nunca commite arquivos `.env.local` ou `.env` no repositório. Use `.env.example` como template.

## 📚 Documentação adicional

- [Arquitetura do Sistema](docs/ARCHITECTURE.md) - Detalhes sobre a arquitetura e fluxos do sistema
- [Relatório Técnico](REPORT.md) - Relatório acadêmico completo do projeto
- [Guia de Contribuição](CONTRIBUTING.md) - Como contribuir com o projeto
- [Política de Segurança](SECURITY.md) - Medidas de segurança implementadas
- [Documentação do Banco de Dados](supabase/README.md) - Scripts SQL e estrutura do banco

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](CONTRIBUTING.md) para mais detalhes sobre como contribuir com o projeto.

## 📄 Licença

Este projeto é público e de código aberto. Qualquer pessoa pode contribuir para melhorá-lo, seja através de correções de bugs, novas funcionalidades, melhorias de documentação ou qualquer outra forma de contribuição construtiva.

## 👥 Autores

- Eduardo Henrique Tresman
- Cristiano Cardozo Lopes

Desenvolvido como projeto acadêmico.

---

**TypeTech** - Melhore suas habilidades de digitação de forma divertida e social! ⌨️
