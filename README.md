# ZPL Draft Admin Dashboard

A high-performance, real-time command center built for the **ZPL Sports Draft**. This dashboard enables league administrators to manage player profiles, orchestrate live bidding sequences, and assign players to franchises with zero-latency synchronization.

---

## ⚡ Core Features

- **Live Auction Sequence (On-Block Logic)**:
    - **Real-time Status Orchestration**: One-click logic to move players "On-Block", triggering instant updates across all administrative and spectator views.
    - **Precision Bidding Controls**: Integrated controls for standard draft increments (+0.5L, +1L, +5L) with built-in floor price protection.
- **Fail-Safe Sale Confirmation**:
    - **Two-Phase Verification**: Segregated workflow for validating final bid amounts and selecting the winning franchise to prevent accidental misallocation.
- **Unified Currency Normalization**:
    - **User-Friendly Lakhs**: Input and display values in standard Lakhs (e.g., `5.5`).
    - **Absolute Backend Mapping**: Automatic background translation to numerical values (e.g., `550,000`) for API consistency.
- **Comprehensive Player Management**:
    - **Full-Page Profiling**: Dedicated, rich interfaces for audit trails, scout reports, and status history.
    - **Streamlined Editing**: Rapid adjustment of names, assigned teams, and final valuations.
- **Integrated Command-K Search**: Integrated sidebar search for instantaneous player discovery and navigation.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **API Layer**: [Axios](https://axios-http.com/) for resilient request handling.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated HSL-based design system.
- **Components**: [Shadcn UI](https://ui.shadcn.com/) and [Phosphor Icons](https://phosphoricons.com/).

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- Access to the ZPL Backend API

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd zpl-admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   Update `app/api/action.ts` with the correct `BASE_URL`:
   ```typescript
   export const BASE_URL = "your-api-endpoint";
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

- `app/admin`: Core routing for dashboard and player management.
- `app/api`: Centralized API client and action logic.
- `app/services`: TanStack Query hooks and server-state synchronization.
- `app/types`: Strict TypeScript interfaces for players, teams, and responses.
- `components/ui`: Primitive UI components built on Shadcn patterns.

---

*Verified & Documented for the ZPL Sports League.*
