import type {
  KanbanColumnConfig,
  BaseTone,
  LayoutNavigationItem,
  TaskAvatarTone,
  TaskDisplayStatus,
  TaskDisplayStatusOption,
  TaskPriority,
  TaskPriorityOption,
  TaskSortOption,
  TaskStatus,
  TaskStatusLabelVariant,
  TaskStatusOption,
  TaskView,
  TaskViewOption,
} from '@/BLL/taskManager/types'

export const ACTIVE_VIEW_STORAGE_KEY = 'task-manager-active-view'

export const DEFAULT_TASK_VIEW: TaskView = 'board'

export const TASK_VIEW_OPTIONS: TaskViewOption[] = [
  {
    value: 'board',
    label: 'Board',
    icon: 'board',
  },
  {
    value: 'list',
    label: 'List',
    icon: 'list',
  },
]

export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export const AVATAR_TONES: TaskAvatarTone[] = [
  'avatar-0',
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
  'avatar-5',
  'avatar-6',
  'avatar-7',
]

export const DEFAULT_AVATAR_TONE: TaskAvatarTone = 'avatar-0'

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    status: 'todo',
    label: 'To do',
    tone: 'todo',
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    tone: 'progress',
  },
  {
    status: 'done',
    label: 'Done',
    tone: 'done',
  },
]

export const STATUS_LABELS: Record<TaskStatusLabelVariant, Record<TaskStatus, string>> = {
  board: {
    todo: 'Not Started',
    'in-progress': 'In Progress',
    done: 'Done',
  },
  list: {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
  },
  empty: {
    todo: 'todo',
    'in-progress': 'in progress',
    done: 'done',
  },
}

export const TASK_DISPLAY_STATUS_LABELS: Record<TaskDisplayStatus, string> = {
  'not-started': 'Not Started',
  'in-research': 'In Research',
  'on-track': 'On Track',
  completed: 'Completed',
}

export const TASK_DISPLAY_STATUS_OPTIONS: TaskDisplayStatusOption[] = [
  {
    value: 'not-started',
    label: TASK_DISPLAY_STATUS_LABELS['not-started'],
  },
  {
    value: 'in-research',
    label: TASK_DISPLAY_STATUS_LABELS['in-research'],
  },
  {
    value: 'on-track',
    label: TASK_DISPLAY_STATUS_LABELS['on-track'],
  },
  {
    value: 'completed',
    label: TASK_DISPLAY_STATUS_LABELS.completed,
  },
]

export const TASK_DISPLAY_STATUS_TONES: Record<TaskDisplayStatus, BaseTone> = {
  'not-started': 'primary',
  'in-research': 'warning',
  'on-track': 'danger',
  completed: 'success',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const DEFAULT_ASSIGNEE = 'Davis Donin'

export const STATUS_OPTIONS: TaskStatusOption[] = [
  {
    value: 'todo',
    label: 'Todo',
  },
  {
    value: 'in-progress',
    label: 'In Progress',
  },
  {
    value: 'done',
    label: 'Done',
  },
]

export const PRIORITY_OPTIONS: TaskPriorityOption[] = [
  {
    value: 'low',
    label: 'Low',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'high',
    label: 'High',
  },
]

export const TASK_SORT_OPTIONS: TaskSortOption[] = [
  {
    key: 'dueDate',
    direction: 'asc',
    label: 'Due Date: Ascending',
  },
  {
    key: 'dueDate',
    direction: 'desc',
    label: 'Due Date: Descending',
  },
  {
    key: 'priority',
    direction: 'desc',
    label: 'Priority: High to Low',
  },
  {
    key: 'priority',
    direction: 'asc',
    label: 'Priority: Low to High',
  },
  {
    key: 'createdAt',
    direction: 'desc',
    label: 'Created Date: Newest First',
  },
  {
    key: 'createdAt',
    direction: 'asc',
    label: 'Created Date: Oldest First',
  },
  {
    key: 'title',
    direction: 'asc',
    label: 'Title: A to Z',
  },
  {
    key: 'title',
    direction: 'desc',
    label: 'Title: Z to A',
  },
  {
    key: 'assignee',
    direction: 'asc',
    label: 'Assignee: A to Z',
  },
  {
    key: 'assignee',
    direction: 'desc',
    label: 'Assignee: Z to A',
  },
  {
    key: 'status',
    direction: 'asc',
    label: 'Status: Todo to Done',
  },
]

export const SIDEBAR_NAVIGATION_ITEMS: LayoutNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    isActive: false,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    isActive: false,
  },
  {
    id: 'task',
    label: 'Task',
    icon: 'task',
    isActive: true,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: 'calendar',
    isActive: false,
  },
  {
    id: 'member',
    label: 'Member',
    icon: 'member',
    isActive: false,
  },
]

export const SIDEBAR_WORKSPACE_ITEMS: LayoutNavigationItem[] = [
  {
    id: 'gasvla-folder',
    label: 'Gasvla Folder',
    icon: 'folder',
    isActive: false,
    iconTone: 'brand',
  },
  {
    id: 'kalburn-project',
    label: 'Kalburn Project',
    icon: 'folder',
    isActive: false,
    iconTone: 'brand',
  },
]

export const SIDEBAR_UTILITY_ITEMS: LayoutNavigationItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    isActive: false,
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'logout',
    isActive: false,
  },
]
