# Prequel - Media Tracking App

## Project Overview

Prequel is a React Native application built with Expo that serves as a media tracking application for movies and TV shows. The app integrates with The Movie Database (TMDB) API to allow users to search for, track, and manage their media library. It features a clean, modern UI with glass effect tab navigation and uses SQLite for local data persistence.

### Key Technologies
- **Framework**: Expo (React Native)
- **Navigation**: Expo Router with bottom tabs
- **Database**: Expo SQLite for local storage
- **UI Components**: React Native with expo-glass-effect for modern UI elements
- **API Integration**: TMDB API for media data
- **State Management**: React hooks (useState, useEffect, useFocusEffect)

### Architecture
The app follows a modular architecture with clear separation of concerns:

- **App Structure**: Uses Expo Router with a tab-based navigation system
- **Components**: Reusable UI components (e.g., GlassTabBar, SearchResultItem)
- **Libraries**: Business logic organized in `/lib` directory with subdirectories for API, repositories, and services
- **Database**: SQLite schema defined in `/lib/schema.ts` with repositories managing data access
- **API Layer**: TMDB API integration in `/lib/api/tmdb.ts` with data mapping utilities

### Features
1. **Home Screen**: Main landing page
2. **Library Screen**: Displays user's saved movies and TV shows
3. **Search Screen**: Allows searching for movies and TV shows via TMDB API
4. **Media Detail Pages**: Detailed views for individual media items
5. **Episode Tracking**: For TV shows, tracks individual episodes and viewing status

## Building and Running

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- TMDB API key (set as EXPO_PUBLIC_TMDB_API_KEY environment variable)

### Setup Instructions
1. Install dependencies: `pnpm install`
2. Set up environment variables:
   - Create a `.env` file with `EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here`
3. Run the application:
   - Development: `pnpm start`
   - Android: `pnpm android`
   - iOS: `pnpm ios`
   - Web: `pnpm web`

### Environment Variables
- `EXPO_PUBLIC_TMDB_API_KEY`: Required API key for TMDB API access

## Development Conventions

### Code Structure
- **Components**: Located in `/component` directory, reusable UI elements
- **App Screens**: Located in `/app` directory using Expo Router file-based routing
- **Business Logic**: Organized in `/lib` directory with clear separation:
  - `/api`: External API integrations and data mapping
  - `/repositories`: Database access layer
  - `/services`: Business logic combining API and database operations

### Database Schema
The application uses SQLite with three main tables:
1. **movies**: Stores movie information with status (wishlist/watched)
2. **tv_series**: Stores TV series information
3. **episodes**: Stores individual episode information linked to TV series

### Navigation
- Uses Expo Router with file-based routing
- Tab navigation implemented with custom GlassTabBar component
- Media detail screens accessible via dynamic routes: `/media/[media_type]/[tmdb_id]`

### Data Flow
1. Search results come from TMDB API
2. Selected items are stored in local SQLite database
3. Library screen displays items from the database
4. Episode tracking for TV shows is handled separately

## Key Files and Directories

- `app/(tabs)/`: Contains the three main tab screens (index, library, search)
- `app/media/`: Dynamic routes for media detail pages
- `lib/api/tmdb.ts`: TMDB API client and methods
- `lib/schema.ts`: Database schema definitions
- `lib/db.ts`: Database connection management
- `lib/services/libraryService.ts`: Library management business logic
- `component/GlassTabBar.tsx`: Custom glass effect tab bar component