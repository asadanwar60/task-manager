# Task Manager

Vue 3 + TypeScript task manager built for the SpectroNovaSoft frontend assessment. The purpose of the project is to demonstrate a production-minded task workflow UI with clear architecture, strict typing, and a single business-logic boundary.

High-level features:

- Kanban Board and grouped List View
- Create, edit, delete, and detail views for tasks
- Native drag-and-drop status movement
- Filtering and sorting through `TaskManager`
- Priority, status, tag, assignee, overdue, and empty-state UI coverage
- Reusable layout, dialog, button, chip, avatar, input, checkbox, and action-menu components

## Setup

Prerequisites:

- Node.js `^22.18.0` or `>=24.12.0`
- npm

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Useful verification commands:

```sh
npm run type-check
npm run build
npm run lint
```

## Architecture Overview

The application is organized around a strict separation between business logic and presentation.

## Folder Structure

```text
src/
├── BLL/taskManager/
│   ├── TaskManager.ts
│   ├── mockData.ts
│   └── types.ts
├── components/
│   ├── layout/
│   ├── shared/
│   └── taskManager/
├── constants/
├── layouts/
├── pages/taskManager/
├── router/
└── styles/
```

## Business Logic Separation

- `src/BLL/taskManager/types.ts` contains shared TypeScript models, props, emits, and UI-facing interfaces.
- `src/BLL/taskManager/mockData.ts` exports the initial `Task[]` seed data used by `TaskManager`.
- `src/BLL/taskManager/TaskManager.ts` is the single source of business logic.
- `src/pages/taskManager/index.vue` creates exactly one `TaskManager` instance, composes the feature page, and passes the manager to task-manager children through typed props.
- `src/components/taskManager/` contains the feature presentation layer: `KanbanBoard`, `KanbanColumn`, `TaskCard`, `TaskList`, `TaskModal`, `TaskDetailDrawer`, `ViewToggle`, and toolbar dropdowns.
- `src/components/shared/` contains reusable UI primitives such as buttons, chips, avatars, inputs, dialogs, checkbox, and action menus.
- `src/layouts/AppLayout.vue` composes the sidebar, header, and main content shell. It is applied by the Task Manager feature entry point.
- `src/styles/` contains SCSS tokens and global component styles for colors, typography, spacing, radii, shadows, and utilities.

`TaskManager` owns CRUD, validation, filtering, sorting, overdue detection, assignee/avatar derivation, date formatting, drag-and-drop status updates, active-view persistence, task selection, and task workflow state for the create/edit modal, detail drawer, and delete dialog. Components render manager output, keep only presentation state such as dropdown visibility, collapsed list sections, drag-over highlights, and menu open state, then call manager methods for application behavior.

Data flow is intentionally simple:

```text
mockData.ts -> TaskManager reactive state -> typed props -> presentation components
                         ^                                      |
                         |                                      v
                  public manager API <-------------- user interaction
```

One `TaskManager` instance is used so every view reads and updates the same in-memory task collection and workflow state. Typed props and emits were preferred over global state because the feature tree is shallow and explicit dependencies are easier to review than hidden store access. This avoids Pinia, Vuex, or provide/inject while still keeping the codebase maintainable for the assessment scope.

The main trade-off is that `TaskManager` uses Vue's `reactive()` internally. This keeps the class as the single business/application state boundary while allowing components to update without manual refresh keys or an external store. The class is still the only place where task rules and task state live.

## TaskManager Design

`TaskManager` is a class-based business layer with two clear sections:

- Public arrow-function API methods consumed by Vue components.
- Private standard class methods used as internal helpers.

The public API is intentionally implemented as arrow functions so methods can be passed directly to component events without losing `this`.

```vue
@edit-task="taskManager.openEditTask"
```

That avoids `.bind(this)` and removes wrapper methods in `index.vue` that only forwarded calls. Private helpers remain standard class methods because they are not passed outside the class and are easier to scan as implementation details.

`TaskManager` currently owns:

- Task collection state loaded from `mockData.ts`
- Create, update, delete, and save orchestration
- Create/edit form state generation and validation
- Modal, drawer, delete confirmation, active view, and task selection state
- Filtering and sorting state
- Filtered/sorted task pipeline
- Status movement through `moveTo()`
- LocalStorage persistence for active view
- Derived labels, tones, formatted dates, avatar metadata, and activity entries

## Component Hierarchy

```text
App.vue
└── RouterView
    └── pages/taskManager/index.vue
        └── AppLayout
            ├── AppSidebar
            ├── AppHeader
            └── Task Manager content
                ├── ViewToggle
                ├── FilterDropdown / SortDropdown
                ├── KanbanBoard
                │   └── KanbanColumn
                │       └── TaskCard
                ├── TaskList
                ├── TaskModal
                ├── TaskDetailDrawer
                └── BaseConfirmDialog
```

`App.vue` is intentionally minimal and only renders the router. The feature entry point keeps the Task Manager layout composition together with the single `TaskManager` instance.

## State Management Strategy

The project does not use Pinia, Vuex, provide/inject, or composable stores. The assessment asks for a single `TaskManager` class, so application state is centralized there.

Vue components may keep presentation-only state:

- Toolbar dropdown open/close
- List section collapsed state
- Drag-over visual state
- Action menu open state
- Temporary form field values while a modal is open

Business and application state stays in `TaskManager`:

- Active view
- Filters and sorting
- Selected task IDs
- Detail drawer target
- Create/edit modal state
- Delete confirmation state
- Task collection and status movement

## Reusable Component Strategy

Reusable UI lives in `src/components/shared/` and is intentionally small:

- `BaseButton` standardizes solid, outline, ghost, and icon button usage.
- `BaseChip` and `BaseTagList` keep priority, status, and tag styling consistent.
- `BaseAvatar` and `BaseAssigneeStack` provide deterministic avatar initials, grouped avatar overlap, tooltips, overflow counts, and the unassigned placeholder state.
- `BaseDialog`, `BaseConfirmDialog`, `BaseInput`, `BaseCheckbox`, and `BaseActionMenu` cover repeated modal, form, checkbox, and menu patterns.

Task-specific components consume these primitives instead of reimplementing controls. For example, Kanban cards, List rows, and the Task Detail Drawer all use the same avatar and tag rendering components, so visual fixes apply across the feature.

## TypeScript Strategy

The task-manager feature keeps shared types in `src/BLL/taskManager/types.ts`. This includes task models, manager state, form state, validation result shapes, component props, component emits, menu items, and reusable UI prop types.

The project avoids `any`, keeps props and emits typed, and keeps `TaskManager` method signatures explicit. Centralizing the feature types makes the interview walkthrough simpler: data shape, UI contracts, and manager contracts can be reviewed from one file.

## SCSS / Design System

The styling system is intentionally compact:

```text
src/styles/
├── _colors.scss
├── _mixins.scss
├── _spacing.scss
├── _typography.scss
└── index.scss
```

`src/styles/index.scss` is registered globally from `src/main.ts`. The SCSS files define the color palette, spacing scale, typography tokens, radius and shadow values, layout utilities, icon classes, component-independent UI styles, and task-manager feature styles. The implementation uses these tokens to match the provided desktop Dribbble reference without scattering one-off values through Vue templates.

## Design Decisions

### Single TaskManager Boundary

**Decision:** Keep all task behavior inside `TaskManager` instead of distributing logic across components or a store.

**Why:** The assessment evaluates class architecture and separation of concerns. A single business layer makes it clear where CRUD, filtering, sorting, validation, and status movement happen.

**Benefit:** Components stay small and presentation-focused, and the data flow is easy to trace during review.

**With more time:** I would add focused unit tests around `TaskManager` methods to lock down filtering, sorting, validation, and drag/drop status changes.

### Reusable Shared UI Primitives

**Decision:** Extract repeated UI patterns into `BaseButton`, `BaseChip`, `BaseAvatar`, `BaseAssigneeStack`, `BaseDialog`, `BaseInput`, and `BaseActionMenu`.

**Why:** Kanban cards, list rows, modals, and the detail drawer share the same chips, avatars, menus, and actions.

**Benefit:** Visual behavior stays consistent, and changes such as the unassigned avatar state automatically apply across Kanban, List View, and Task Detail.

**With more time:** I would document the shared component API in Storybook or a lightweight component reference.

### Kanban and Grouped List Presentations

**Decision:** Build both views from the same `TaskManager` data pipeline while giving each view its own presentation: Kanban columns for spatial workflow and grouped list sections for dense scanning.

**Why:** The assessment requires Kanban and List views, but duplicating data logic in each view would make sorting, filtering, and status movement harder to reason about.

**Benefit:** Both views reflect the same filtered/sorted task state, while users can choose between card-based planning and table-like review.

**With more time:** I would add automated interaction tests to verify that drag/drop, sorting, filtering, and modal flows stay consistent across both views.

### Native Drag and Drop

**Decision:** Use the browser's native HTML5 Drag & Drop API.

**Why:** The assessment does not require a drag library, and the app only needs status movement between Todo, In Progress, and Done.

**Benefit:** Fewer dependencies and a direct path to calling `TaskManager.moveTo()` for status updates.

**With more time:** I would improve keyboard-accessible drag interactions and add stronger visual drop indicators.

### Central SCSS Design Tokens

**Decision:** Keep design colors, spacing, typography, radius, shadows, z-indexes, and reusable utilities in `src/styles`.

**Why:** The UI has many repeated controls, badges, cards, drawers, and table states that need consistent spacing and colors.

**Benefit:** Component templates remain cleaner and styling changes are easier to make without scattering magic values.

**With more time:** I would further split long feature styles into smaller style modules once the assessment constraints are fully frozen.

## Engineering Trade-offs

- **No global store:** Pinia/Vuex were intentionally avoided because the assessment asks for a single `TaskManager` class. Typed props make dependencies visible and keep the feature easy to inspect.
- **Vue reactivity inside the manager:** `TaskManager` uses `reactive()` internally so components update when manager-owned state changes. This is a deliberate compromise: Vue powers the UI updates, but the business/application state boundary remains the class.
- **Arrow-function public API:** Public `TaskManager` methods are arrow properties so they can be passed directly as Vue event handlers without callback binding regressions. Private helper methods remain standard class methods to keep implementation details visually separate.
- **Centralized types:** Shared props, emits, task models, and UI-facing interfaces live in `types.ts`. This keeps strict TypeScript coverage consistent, but the file is larger than it would be in a fully modular production app.
- **In-memory data model:** `TaskManager` clones and owns the mock data on construction. This is simple and reviewable, but it is not a persistence strategy.
- **Native drag-and-drop:** Native HTML5 drag/drop avoids another dependency and maps directly to `TaskManager.moveTo()`. The trade-off is weaker keyboard support than a custom accessible drag system.
- **Global SCSS for feature styles:** Styles are centralized around tokens and reusable selectors instead of scoped component styles. This makes token compliance easier, but it requires discipline to keep selectors organized.

## Project Highlights

- Vue 3 Composition API with strict TypeScript
- Exactly one `TaskManager` business-logic layer
- No Pinia, Vuex, or provide/inject
- Typed props and typed emits across task-manager components
- Kanban Board and grouped List View backed by the same task pipeline
- Native HTML5 drag-and-drop status movement
- Reusable shared UI primitives for buttons, chips, avatars, dialogs, inputs, checkbox, and action menus
- Deterministic grouped avatars with unassigned placeholder support
- Confirmation dialog before delete
- Inline create/edit validation through `TaskManager`
- SCSS design tokens for colors, typography, spacing, radii, shadows, and utility classes
- Desktop-focused responsive shell with 1280px minimum layout target

## Known Limitations

- Data is in-memory mock data. Reloading the page resets task changes except for the persisted active view.
- Drag and drop is mouse-first. Keyboard drag/drop support would need additional accessibility work.
- Filtering currently supports the assessment-required priority and assignee filters, plus status and tag filters for UI completeness.
- The app shell includes placeholder navigation items for future pages such as Dashboard, Calendar, and Notifications.
- Mobile responsiveness is not implemented because the assessment and design audit targeted desktop layouts at a minimum width of 1280px.

## Time Log

Approximate breakdown:

- Project setup and instruction alignment: 2 hours
- Type models, mock data, and `TaskManager`: 4 hours
- App layout, sidebar, and header: 4 hours
- Kanban board, columns, cards, and drag/drop: 6 hours
- List View, grouping, sorting, and row interactions: 6 hours
- Create, edit, delete, validation, and dialogs: 5 hours
- Filtering and toolbar dropdowns: 3 hours
- Task detail drawer and shared UI components: 5 hours
- SCSS design system and visual refinement: 6 hours
- Refactoring, architecture hardening, compliance audit, and validation: 7 hours
- README and final documentation: 2 hours

Total: roughly 50 hours.
