# 20MinCoach
CASO #1 Diseño de Software


# Project Architecture Documentation

## 0. Executive Summary

This repository contains the front-end architecture design, PoCs and implementation documentation for the 20MinCoach project. Here is a summarized list of the components used for this design:

- **Auth (PoC):** Uses `Supabase` (OTP email) + `TOTP MFA` flows integrated with expo. Supabase is Expo-friendly; replaces Auth0 MFA without the need for custom native configurations, satisfying the authentication requirements for this project.
- **Roles:** From `raw_app_meta_data.roles` 2 roles were defined: BasicUser, PremiumUser.
  - **Action A:** ("Start 20-min request") Basic & Premium.
  - **Action B:** ("View earnings") Premium only. 
- **UI Security:** RequireAuth, RequireRole and RoleGate (component/action-level gates) Dashboards use these guards.
- **HTTP Interceptor:** Injects bearer token; on 401 → sign-out, clear Redux, redirect `/auth`. "Force 401" button added to both dashboards for verification.
- **State & Data plumbing:**
  - **Redux Toolkit:** Slice auth ({email, roles}).
  - **TanStack Query provider:** Retries, cache, refetch on focus.
  - **httpJson helper:** timeout + safe JSON parse (layered on the interceptor).
- **Verification Page:** tools/data-test (inputs in blue for dark mode), uses TanStack Query + httpJson.

## 1. Technology Choices
- **Framework/Navigation:** `React Native`, `Expo`, `expo-router`
  - **React Native:** Enables a single codebase for iOS and Android, providing great cross-platform efficiency.
  - **Expo:** Expo provides an all-in-one environment with minimal native setup, as well as over-the-air updates and easy builds with EAS.
  - **expo-router:**  Simplifies navigation by mapping files to routes automatically, improving maintainability.
  - **Expo Go:** Allows fast testing without the need for custom native modules.
- **Authentication:** `Supabase` (`@supabase/supabase-js`) with `Email OTP` + `TOTP MFA`, secure storage via `expo-secure-store`  
  - **Supabase:** Provides hosted auth and database, reducing backend complexity. Provides an extra security layer to protect user accounts by using TOTP MFA. Enables modern, passwordless login; email OTP steamlines onboarding and improves UX.
  - `@supabase/supabase-js`: JS SDK that works seamlessly in React Native and Expo environments.
  - `expo-secure-store`:  Ensures tokens and secrets are stored encrypted on the device.
- **State Management:** `Redux Toolkit` (global app state), `TanStack Query` (remote server data)
  - **Redux Toolkit:** Holds app logic and provides centralized management for authentication, navigation guards and UI flags. Simplifies setup and enforces best practices.
  - **TanStack Query:** Manages network data, handles caching, retries, background refetching, and synchronization with server state.
- **Networking:** Native `fetch` wrapped by `withAuth` interceptor + `httpJson` utility. 
  - `withAuth`: Adds auth headers and handles token refresh logic in one place.
  - `httpJson`: Adds timeouts and automatic JSON parsing to reduce repetitive code.
 This provides a consistent API layer that ensures all network calls follow the same structure and error handling. Also keeps dependencies minimal while adding key functionality (auth, parsing, retries).
- **Middleware & Security in UI:** Custom guards and interceptors in `/src/middleware`. This will keep UI components clean by abstracting access control and network handling. 
  - `auth.guard.ts`: To ensure only authorized users with correct roles can access certain screens. This will check user roles and redirect unauthorized users.
  - `http.interceptor.ts`: Injects tokens into outgoing requests and handles 401 Unauthorized responses gracefully.
- **Prototype with AI + UX Testing:** `Lovable`, integrated with `Maze` (validar si es esto)
  - `Lovable`: Generates prototype screens consistent with UI components.
  - `Maze`: Allows for UX validation before implementation. Refine UI/UX based on real user interactions.
- **Services, Listeners & Simulations:** Mock simulations, `SSE` (EventSource), `expo-notifications`, `Daily Prebuilt` via `react-native-view`, `/src/services/realtime.ts`
  - `Daily Prebuilt`: Simulated sessions with basic controls using mock URL.
  - `SSE` & `setInterval`: Mocks to emit events (coach availability, acceptance).
  - `/src/services/realtime.ts`: exposes `subscribePresence()` and `subscribeSession()` for consuming events.
  - `expo-notifications`: Registers the device and displays local pushes based on simulations.
- **Business Models & Validation:** `/src/models`, `DTOs`, `Zod` schemas
  - `/src/models`: Define entities that will be used by the application.
  - `/src/services/dto.ts`: Maps API responses to internal models for data transformations.
  - `Zod`: Ensures data integrity with schemas and helps generate validators for new entities.
- **Error Handling & Logging:** `/src/middleware/error.middleware.ts`, `/src/utils/logger.ts`
  - `/src/utils/logger.ts`: Implements **Strategy Pattern** to switch between console output and future remote logging. All layers (services, UI, middleware) use the logger to ensure consistent debugger and traceability. Provides a single point of control for log formatting.
  - `/src/middleware/error.middleware.ts`: Maps API and logic errors to user-friendly UI messages, provides a single point of control for error formatting.
- **Styling:** React Native primitives with custom color scheme (blue inputs/text for dark mode). This avoids extra dependencies, while allowing for high-contrast colors to ensure readability and compliance with accessibility standards. Provides a centralized color palette that promotes uniform design across components.
- **Testing:** `Jest` + `React Testing Library`
  - `Jest`: Provides fats, isolated tests for logic and components. Integrates well with Expo-managed projects.
  - `React Testing Library`: Testing from user's perspective.
Automated tests will catch regressions early in CI/CD.



## Directory Structure
```
src
├── /models # Business domain models
├── /services # Business logic and API layer
├── /validators # Data validation schemas
├── /utils # Utilities (logging, errors)
├── /middleware # Error handling middleware
├── /hooks # Custom React hooks
├── /components # UI components
├── /navigation # App navigation
└── /test-utils # Testing utilities
```

## Architecture Layers

### 1. Models Layer (`/src/models`)
**Purpose**: Represent business entities and encapsulate business logic.

**Key Files**:
- `BaseModel.ts` - Abstract base class for all models
- `User.ts`, `Coach.ts`, `SessionRequest.ts`, `Earning.ts` - Domain models
- `index.ts` - Barrel exports

**Responsibilities**:
- Business logic implementation
- Data validation rules
- Computed properties and methods
- Data transformation methods

### 2. Services Layer (`/src/services`)
**Purpose**: Handle business logic, API communication, and data transformation.

**Key Files**:
- `api.ts` - HTTP client with error handling
- `dto.ts` - Data Transfer Object transformations
- `dailyService.ts` - Video call service (example)

**Responsibilities**:
- API communication
- Data transformation (DTO ↔ Model)
- Business operations coordination
- Error handling

### 3. Validators Layer (`/src/validators`)
**Purpose**: Data validation using Zod schemas.

**Key Files**:
- `schemas.ts` - Zod validation schemas
- `index.ts` - Validation utilities

**Responsibilities**:
- Input validation
- Type safety at runtime
- Schema definitions
- Validation error messages

### 4. Utilities Layer (`/src/utils`)
**Purpose**: Shared utilities and cross-cutting concerns.

**Key Files**:
- `logger.ts` - Strategy-based logging
- `errors.ts` - Custom error classes

**Responsibilities**:
- Logging strategies
- Error class hierarchy
- Utility functions

### 5. Middleware Layer (`/src/middleware`)
**Purpose**: Global error handling and request/response processing.

**Key Files**:
- `error.middleware.ts` - Error handling middleware

**Responsibilities**:
- Global error catching
- Error transformation for UI
- Logging integration

## Data Flow
API Request → API Service → DTO Transformation → Validation → Model → Component
↓
Error Handling → Logging → UI Error Display

All the requested data from the API goes through the API Service, then the DTOs help adapt API fields into the objects used by the models of the project. All DTOs are validated before going to the model.


## 2. How-to Guides

```markdown
# How to Add a New Service

## Step 1: Create the Service File

Create a new file in `/src/services/`:

```typescript
// /src/services/notificationService.ts

import { apiService } from './api';
import { DTOTransformer } from './dto';
import { logger } from '../utils/logger';
import { BusinessError } from '../utils/errors';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: Date;
}

class NotificationService {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      logger.info('Fetching user notifications', { userId });
      
      const response = await apiService.get(`/users/${userId}/notifications`);
      
      // Transform API response to models
      return response.map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.is_read,
        createdAt: new Date(notification.created_at),
      }));
    } catch (error) {
      logger.error('Failed to fetch notifications', error as Error, { userId });
      throw new BusinessError(
        'NOTIFICATIONS_FETCH_FAILED',
        'Failed to load notifications'
      );
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiService.patch(`/notifications/${notificationId}`, {
        read: true,
      });
      logger.debug('Notification marked as read', { notificationId });
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error, { notificationId });
      throw new BusinessError(
        'NOTIFICATION_UPDATE_FAILED',
        'Failed to update notification'
      );
    }
  }
}

export const notificationService = new NotificationService();