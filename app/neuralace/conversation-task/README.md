# Conversation Task Dashboard

This module provides a comprehensive dashboard for monitoring and analyzing volunteer data for the NeuralAce Conversation Task.

## Project Structure

-   **`page.tsx`**: Main Dashboard. Displays high-level metrics, a dynamic bar chart (Weekly/Monthly), and top-performing volunteers.
-   **`live-monitor/page.tsx`**: Live Monitor. Shows real-time status of volunteers in a table view with system stats (CPU, RAM, etc.).
-   **`analytics/page.tsx`**: Analytics. A detailed view with search, sorting, filtering, and drill-down session reports.
-   **`components/`**: Reusable UI components (e.g., `StatsOverview`, `TopVolunteers`, `SessionReport`).
-   **`hooks/`**: Custom hooks like `useVolunteers` for centralized state management and filtering logic.
-   **`data/mockData.ts`**: Contains the mock data generator. Currently configured to generate 120+ volunteers with realistic session data spread across dates.
-   **`types.ts`**: TypeScript definitions for the data models.

## Data Flow

1.  **Mock Data Generation**: `mockData.ts` generates a large dataset of volunteers and sessions on the fly.
2.  **State Management**: `useVolunteers` hook consumes this data and provides filtering (search, date, sort) capabilities to the components.
3.  **Computed Metrics**:
    -   **Dashboard**: `page.tsx` computes summary stats (Total Hours, Avg Time) and aggregates graph data (Weekly/Monthly) using `useMemo` for performance.
    -   **Analytics**: `AnalyticsDashboard.tsx` computes **daily metrics** (e.g., Daily Sessions, Daily Hours) based on the selected date filter, providing a focused view of daily performance.

## Optimization

-   **`useMemo`**: Heavy calculations (stats, graph aggregation, filtering) are memoized to ensure the UI remains responsive even with 100+ volunteers.
-   **Scroll Optimization**: Tables in Live Monitor and Analytics are wrapped in fixed-height containers with sticky headers to prevent the entire page from scrolling, improving usability with large datasets.
-   **Virtualization (Future)**: For datasets > 1000, consider implementing row virtualization in the tables.

## Extending

To replace mock data with a real API:
1.  Update `useVolunteers` to fetch data from an API endpoint using `useEffect` or React Query.
2.  Ensure the API response matches the `Volunteer` interface in `types.ts`.
