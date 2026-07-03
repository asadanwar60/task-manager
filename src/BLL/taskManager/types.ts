import type { TaskManager } from '@/BLL/taskManager/TaskManager'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assignees: string[]
  status: TaskStatus
  displayStatus: TaskDisplayStatus
  tags: string[]
  createdAt: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskDisplayStatus = 'not-started' | 'in-research' | 'on-track' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskView = 'board' | 'list'

export type SortDirection = 'asc' | 'desc'

export type TaskSortKey = 'dueDate' | 'priority' | 'createdAt' | 'title' | 'assignee' | 'status'

export type TaskStatusTone = 'todo' | 'progress' | 'done'

export type TaskStatusLabelVariant = 'board' | 'list' | 'empty'

export type TaskAvatarTone =
  | 'avatar-0'
  | 'avatar-1'
  | 'avatar-2'
  | 'avatar-3'
  | 'avatar-4'
  | 'avatar-5'
  | 'avatar-6'
  | 'avatar-7'

export type BaseTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

export type BaseButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost'

export type BaseButtonSize = 'sm' | 'md'

export type BaseButtonIconPosition = 'start' | 'end'

export type BaseButtonType = 'button' | 'submit' | 'reset'

export type BaseChipShape = 'rounded' | 'pill'

export type BaseInputControl = 'input' | 'textarea'

export type BaseInputType = 'text' | 'date'

export type LayoutIconName =
  | 'add'
  | 'board'
  | 'calendar'
  | 'chevron-down'
  | 'clock'
  | 'close'
  | 'dashboard'
  | 'document'
  | 'drag-handle'
  | 'edit'
  | 'empty-card'
  | 'expand'
  | 'filter'
  | 'flag'
  | 'folder'
  | 'history'
  | 'invite'
  | 'list'
  | 'logo-check'
  | 'logout'
  | 'member'
  | 'more'
  | 'notifications'
  | 'search'
  | 'settings'
  | 'share'
  | 'sort'
  | 'star'
  | 'status'
  | 'tag'
  | 'task'
  | 'trash'

export interface LayoutNavigationItem {
  id: string
  label: string
  icon: LayoutIconName
  isActive: boolean
  iconTone?: 'default' | 'brand'
}

export interface SidebarItemProps {
  item: LayoutNavigationItem
}

export interface LogoProps {
  label: string
}

export interface AppHeaderProps {
  greeting: string
  dateLabel: string
}

export interface TaskFilters {
  priority: TaskPriority | null
  assignee: string | null
  status: TaskStatus | null
  tag: string | null
}

export interface TaskModalState {
  isOpen: boolean
  mode: TaskFormMode
  taskId: string | null
  initialStatus: TaskStatus | null
}

export interface TaskManagerState {
  tasks: Task[]
  filters: TaskFilters
  sortState: TaskSortState | null
  activeView: TaskView
  taskModal: TaskModalState
  detailTaskId: string | null
  pendingDeleteTaskId: string | null
  selectedTaskIds: Set<string>
}

export interface TaskAssigneeAvatar {
  initials: string
  label: string
  tone: TaskAvatarTone
}

export interface BaseAssigneeStackProps {
  avatars: TaskAssigneeAvatar[]
  maxVisible?: number
}

export interface ActionMenuItem {
  id: string
  label: string
  icon?: LayoutIconName
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

export interface BaseActionMenuProps {
  items: ActionMenuItem[]
  ariaLabel?: string
  triggerIcon?: LayoutIconName
  size?: BaseButtonSize
}

export interface TaskActivityEntry {
  id: string
  actor: string
  action: string
  highlight: string
  time: string
}

export interface TaskDraft {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assignees: string[]
  status: TaskStatus
  displayStatus: TaskDisplayStatus
  tags: string[]
}

export interface TaskFormState {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assigneesInput: string
  status: TaskStatus
  displayStatus: TaskDisplayStatus
  tagsInput: string
}

export type TaskFormMode = 'create' | 'edit'

export type TaskValidationField = keyof TaskDraft

export type TaskValidationErrors = Partial<Record<TaskValidationField, string>>

export interface TaskValidationResult {
  isValid: boolean
  errors: TaskValidationErrors
}

export interface TaskStatusOption {
  value: TaskStatus
  label: string
}

export interface TaskDisplayStatusOption {
  value: TaskDisplayStatus
  label: string
}

export interface TaskPriorityOption {
  value: TaskPriority
  label: string
}

export interface TaskViewOption {
  value: TaskView
  label: string
  icon: LayoutIconName
}

export interface TaskSortOption {
  key: TaskSortKey
  direction: SortDirection
  label: string
}

export interface FilterDropdownProps {
  isOpen: boolean
  filters: TaskFilters
  assigneeOptions: string[]
  priorityOptions: TaskPriorityOption[]
  statusOptions: TaskStatusOption[]
  tagOptions: string[]
}

export interface FilterDropdownEmits {
  (event: 'toggle'): void
  (event: 'close'): void
  (event: 'assigneeChange', value: string | null): void
  (event: 'priorityChange', value: TaskPriority | null): void
  (event: 'statusChange', value: TaskStatus | null): void
  (event: 'tagChange', value: string | null): void
  (event: 'clear'): void
}

export interface SortDropdownProps {
  isOpen: boolean
  options: TaskSortOption[]
  selectedValue: string
}

export interface SortDropdownEmits {
  (event: 'toggle'): void
  (event: 'close'): void
  (event: 'select', value: string): void
  (event: 'clear'): void
}

export interface BaseChipProps {
  label: string
  shape?: BaseChipShape
  tone?: BaseTone
  withDot?: boolean
}

export interface BaseTagListProps {
  tags: string[]
  maxVisibleTags?: number
}

export interface BaseButtonProps {
  label?: string
  ariaLabel?: string
  form?: string
  icon?: LayoutIconName
  iconPosition?: BaseButtonIconPosition
  tone?: BaseTone
  variant?: BaseButtonVariant
  size?: BaseButtonSize
  type?: BaseButtonType
}

export interface BaseCheckboxProps {
  checked: boolean
  accessibleLabel: string
  disabled?: boolean
}

export interface BaseCheckboxEmits {
  (event: 'change', checked: boolean): void
}

export interface BaseAvatarProps {
  initials: string
  tone: TaskAvatarTone
  label: string
  isUnassigned?: boolean
}

export interface BaseInputProps {
  id: string
  label: string
  modelValue: string
  type?: BaseInputType
  control?: BaseInputControl
  placeholder?: string
  error?: string
  rows?: number
  suggestions?: string[]
}

export interface BaseInputEmits {
  (event: 'update:modelValue', value: string): void
}

export interface BaseDialogProps {
  title: string
  ariaLabel?: string
  description?: string
  size?: 'sm' | 'md'
}

export interface BaseDialogEmits {
  (event: 'close'): void
}

export interface BaseConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  tone?: BaseTone
}

export interface BaseConfirmDialogEmits {
  (event: 'confirm'): void
  (event: 'cancel'): void
}

export interface ViewToggleProps {
  activeView: TaskView
  options: TaskViewOption[]
}

export interface ViewToggleEmits {
  (event: 'change', view: TaskView): void
}

export interface KanbanColumnConfig {
  status: TaskStatus
  label: string
  tone: TaskStatusTone
}

export interface KanbanBoardProps {
  manager: TaskManager
}

export interface KanbanBoardEmits {
  (event: 'openTask', taskId: string): void
  (event: 'editTask', taskId: string): void
  (event: 'deleteTask', taskId: string): void
  (event: 'createTask', status: TaskStatus): void
}

export interface KanbanColumnProps {
  manager: TaskManager
  status: TaskStatus
  label: string
  tone: TaskStatusTone
}

export interface KanbanColumnEmits {
  (event: 'openTask', taskId: string): void
  (event: 'editTask', taskId: string): void
  (event: 'deleteTask', taskId: string): void
  (event: 'createTask', status: TaskStatus): void
}

export interface TaskCardProps {
  manager: TaskManager
  task: Task
}

export interface TaskCardEmits {
  (event: 'openTask', taskId: string): void
  (event: 'editTask', taskId: string): void
  (event: 'deleteTask', taskId: string): void
}

export interface TaskDetailDrawerProps {
  manager: TaskManager
  task: Task
}

export interface TaskDetailDrawerEmits {
  (event: 'close'): void
  (event: 'editTask', taskId: string): void
  (event: 'deleteTask', taskId: string): void
}

export interface TaskListProps {
  manager: TaskManager
}

export interface TaskListEmits {
  (event: 'createTask', status: TaskStatus): void
  (event: 'openTask', taskId: string): void
  (event: 'editTask', taskId: string): void
  (event: 'deleteTask', taskId: string): void
}

export interface TaskSortState {
  key: TaskSortKey
  direction: SortDirection
}

export interface TaskModalProps {
  manager: TaskManager
  mode: TaskFormMode
  taskId: string | null
  initialStatus: TaskStatus | null
}

export interface TaskModalEmits {
  (event: 'saved'): void
  (event: 'cancel'): void
}
