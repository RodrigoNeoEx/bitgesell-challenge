Approach
This project implements a paginated item list with detailed views using React 18, React Router v6, Tailwind CSS, and React Window for performance optimization. A global cache mechanism via React Context API is employed to minimize redundant API calls and improve UX.

Data Caching
Centralized item cache stored in a Context provider (DataContext).

fetchItems performs paginated queries and merges new items into the cache, avoiding duplicates.

getItemById attempts to resolve item data from the cache before fetching from the backend, reducing unnecessary requests when navigating between list and detail views.

Component Structure
Items: handles search, pagination, loading states, and renders a virtualized list of items. Uses the context’s fetchItems and local state to control queries and UI.

ItemDetail: fetches a single item using getItemById, showing loading skeletons and redirecting on errors.

App: sets up routes and wraps the app in the cache provider; includes a full-page background image styled with Tailwind.

Performance & UX
Virtualization via react-window efficiently renders large lists without UI lag.

Cached data ensures fast back navigation with no extra fetches.

Skeleton loaders improve perceived performance during data fetching.

Tailwind CSS used throughout for consistent, responsive styling with minimal custom CSS.

Trade-offs
The cache is simple, stored only in-memory; no persistence across sessions.

Incremental cache merging can lead to stale data if backend changes frequently without refresh.

More complex state management libraries (e.g., Zustand, React Query) were avoided for simplicity but could provide advanced caching and syncing features.

Virtualization limits accessibility slightly as screen readers may not read virtualized items properly without additional ARIA handling.