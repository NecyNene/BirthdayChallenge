# The Birthday Challenge

## Overview

The Birthday Challenge is a single-page web application game built for a user named Dave. It's an interactive quiz game with a crypto-style virtual bank mechanic where the player starts with 100 virtual dollars and must answer six questions. The final balance determines the real-world birthday gift amount. The application features a dark, techie aesthetic with muted orange accents and includes a welcome screen, game interface with timed questions, hints system, and an end screen for gift selection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with hot module replacement
- Single-page application using wouter for client-side routing
- Component structure follows a screen-based pattern (welcome, game, end screens)

**UI Component Library**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode enforced by default with custom color palette (dark charcoal background, muted orange primary accent)
- Component aliases configured for clean imports (@/components, @/lib, etc.)

**State Management**
- React hooks (useState, useEffect, useRef) for local component state
- @tanstack/react-query for server state management and API interactions
- Game state managed in the main BirthdayChallenge component and passed down via props
- No global state management library needed due to simple application structure

**Game Logic & Features**
- Question-based progression system with six total questions
- Dynamic balance system with penalties for wrong answers, timeouts, and hint usage
- Countdown timer per question with automatic progression
- Multiple hint types: textual hints, multiple choice options, and fifty-fifty elimination
- Confetti animation library integration for celebratory effects
- Real-time feedback on answer correctness with transaction messages

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- HTTP server created via Node's native http module
- Custom logging middleware for API request monitoring
- JSON body parsing with raw body preservation for webhook compatibility

**API Endpoints**
- POST `/api/game-results` - Submit completed game results with player name, final balance, and gift preferences
- GET `/api/game-results` - Retrieve all game results (administrative/historical data)
- Request validation using Zod schemas via drizzle-zod integration

**Data Layer**
- In-memory storage implementation (MemStorage class) for development/simple deployments
- Storage interface abstraction (IStorage) allows for easy swap to database-backed storage
- PostgreSQL schema defined via Drizzle ORM but currently using memory-based fallback
- Schema includes game results table with player name, final balance, gift type, gift address, and completion timestamp

### Design System

**Visual Theme**
- Dark mode color scheme: very dark charcoal background (hsl(0 0% 10%))
- Primary accent: muted orange (hsl(24 85% 48%))
- Typography: DM Sans for body text, Architects Daughter for decorative elements, Fira Code/Geist Mono for code/technical text
- Rounded minimal buttons and cards with subtle shadows (no neon effects)
- Mobile-first responsive design with breakpoint at 768px

**Animation Strategy**
- CSS-based entrance animations (fade-in, slide-in, zoom-in) on welcome screen
- Delayed instruction box reveal (2.5 seconds after title animation)
- Graffiti-style text effects with multiple text shadows and rotation transforms
- Confetti effects via canvas-confetti library for victory moments

### External Dependencies

**Third-Party Libraries**
- @neondatabase/serverless - Neon serverless Postgres driver (configured but using memory storage)
- drizzle-orm & drizzle-kit - Type-safe ORM and migration tooling for PostgreSQL
- @tanstack/react-query - Server state management and data fetching
- @radix-ui/* - Headless UI component primitives for accessibility
- canvas-confetti - Particle animation library loaded via CDN
- wouter - Lightweight client-side routing (< 2KB)
- react-hook-form with @hookform/resolvers - Form validation and management
- zod - Runtime type validation and schema definition
- date-fns - Date manipulation utilities
- class-variance-authority & clsx - Dynamic className generation utilities

**Database Integration**
- Drizzle ORM configured for PostgreSQL with Neon serverless driver
- Database URL expected via DATABASE_URL environment variable
- Migration files output to ./migrations directory
- Schema location: ./shared/schema.ts
- Currently using in-memory fallback storage (MemStorage) until database is provisioned

**Development Tools**
- Replit-specific plugins for development (cartographer, dev-banner, runtime-error-modal)
- TypeScript with strict mode enabled
- ESBuild for production server bundling
- PostCSS with Tailwind and Autoprefixer

**Font Loading**
- Google Fonts API for web fonts (DM Sans, Architects Daughter, Fira Code, Geist Mono)
- Preconnect hints for performance optimization

## Recent Changes

### Email Notification Feature
- Added email sending capability to notify verleepollock@gmail.com of game results
- Integrated email service using Nodemailer with environment-based SMTP configuration
- Updated end screen to collect player email for confirmation messages
- SendGrid integration was dismissed by user; implemented via environment-based SMTP instead

## Notes
- SendGrid integration was offered but dismissed (2025-11-22). Using environment-based SMTP configuration instead.
- Deployment blocker note: .replit file cannot be edited directly due to system restrictions. Port configuration (5000→80 mapping) is already set correctly in deployment section.