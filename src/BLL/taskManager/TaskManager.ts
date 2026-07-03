import { reactive } from 'vue'
import { mockTasks } from '@/BLL/taskManager/mockData'
import type {
  TaskSortKey,
  TaskSortOption,
  TaskSortState,
  Task,
  TaskActivityEntry,
  TaskAssigneeAvatar,
  TaskAvatarTone,
  TaskDisplayStatus,
  TaskDisplayStatusOption,
  TaskDraft,
  TaskFilters,
  TaskFormMode,
  TaskFormState,
  KanbanColumnConfig,
  TaskPriority,
  TaskPriorityOption,
  TaskStatus,
  TaskStatusOption,
  TaskStatusLabelVariant,
  TaskValidationErrors,
  TaskValidationResult,
  TaskView,
  BaseTone,
  TaskManagerState,
} from '@/BLL/taskManager/types'
import {
  ACTIVE_VIEW_STORAGE_KEY,
  AVATAR_TONES,
  DEFAULT_ASSIGNEE,
  DEFAULT_AVATAR_TONE,
  DEFAULT_TASK_VIEW,
  KANBAN_COLUMNS,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_WEIGHT,
  STATUS_LABELS,
  STATUS_OPTIONS,
  TASK_DISPLAY_STATUS_LABELS,
  TASK_DISPLAY_STATUS_OPTIONS,
  TASK_DISPLAY_STATUS_TONES,
  TASK_SORT_OPTIONS,
} from '@/constants'

export class TaskManager {
  private state: TaskManagerState

  public constructor(seedTasks: Task[] = mockTasks) {
    this.state = reactive<TaskManagerState>({
      tasks: seedTasks.map((task: Task): Task => this.cloneTask(task)),
      filters: this.getDefaultFilters(),
      sortState: null,
      activeView: this.readActiveView(),
      taskModal: {
        isOpen: false,
        mode: 'create',
        taskId: null,
        initialStatus: null,
      },
      detailTaskId: null,
      pendingDeleteTaskId: null,
      selectedTaskIds: new Set<string>(),
    })
  }

  // Public API: arrow functions keep lexical `this` when Vue receives them as callbacks.
  public getTasks = (): Task[] => {
    return this.cloneTasks(this.state.tasks)
  }

  public getTask = (taskId: string): Task | null => {
    const task = this.state.tasks.find((currentTask: Task): boolean => currentTask.id === taskId)

    return task ? this.cloneTask(task) : null
  }

  public getTasksByStatus = (status: TaskStatus): Task[] => {
    return this.cloneTasks(
      this.getFilteredAndSortedTasks().filter((task: Task): boolean => task.status === status),
    )
  }

  public getKanbanColumns = (): KanbanColumnConfig[] => {
    return KANBAN_COLUMNS.map((column: KanbanColumnConfig): KanbanColumnConfig => ({ ...column }))
  }

  public getStatusOptions = (): TaskStatusOption[] => {
    return STATUS_OPTIONS.map((option: TaskStatusOption): TaskStatusOption => ({ ...option }))
  }

  public getPriorityOptions = (): TaskPriorityOption[] => {
    return PRIORITY_OPTIONS.map((option: TaskPriorityOption): TaskPriorityOption => ({ ...option }))
  }

  public getSortOptions = (): TaskSortOption[] => {
    return TASK_SORT_OPTIONS.map((option: TaskSortOption): TaskSortOption => ({ ...option }))
  }

  public getDisplayStatusOptions = (): TaskDisplayStatusOption[] => {
    return TASK_DISPLAY_STATUS_OPTIONS.map((option: TaskDisplayStatusOption): TaskDisplayStatusOption => ({
      ...option,
    }))
  }

  public getTaskFormState = (
    taskId: string | null,
    initialStatus: TaskStatus | null = null,
  ): TaskFormState => {
    const task = taskId ? this.getTask(taskId) : null
    const draft = task ?? this.getDefaultTaskDraft(initialStatus ?? 'todo')

    return {
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      dueDate: draft.dueDate,
      assigneesInput: draft.assignees.join(', '),
      status: draft.status,
      displayStatus: draft.displayStatus,
      tagsInput: draft.tags.join(', '),
    }
  }

  public saveTask = (
    mode: TaskFormMode,
    taskId: string | null,
    formState: TaskFormState,
  ): TaskValidationResult => {
    const draft = this.createDraftFromFormState(formState)

    if (mode === 'edit' && taskId !== null) {
      return this.updateTask(taskId, draft)
    }

    return this.createTask(draft)
  }

  public getEmptyValidationResult = (): TaskValidationResult => {
    return {
      isValid: true,
      errors: {},
    }
  }

  public createTask = (draft: TaskDraft): TaskValidationResult => {
    const validation = this.validateTask(draft)

    if (!validation.isValid) {
      return validation
    }

    const task: Task = {
      ...this.normalizeDraft(draft),
      id: this.createTaskId(),
      createdAt: new Date().toISOString(),
    }

    this.state.tasks = [task, ...this.state.tasks]

    return validation
  }

  public updateTask = (taskId: string, draft: TaskDraft): TaskValidationResult => {
    const validation = this.validateTask(draft)

    if (!validation.isValid) {
      return validation
    }

    this.state.tasks = this.state.tasks.map((task: Task): Task => {
      if (task.id !== taskId) {
        return task
      }

      return {
        ...task,
        ...this.normalizeDraft(draft),
      }
    })

    return validation
  }

  public deleteTask = (taskId: string): void => {
    this.state.tasks = this.state.tasks.filter((task: Task): boolean => task.id !== taskId)
    this.state.selectedTaskIds.delete(taskId)
  }

  public moveTo = (taskId: string, status: TaskStatus): void => {
    this.state.tasks = this.state.tasks.map((task: Task): Task => {
      if (task.id !== taskId) {
        return task
      }

      return {
        ...task,
        status,
      }
    })
  }

  public getFilteredAndSortedTasks = (): Task[] => {
    return this.sortTasks(this.filterTasks(this.state.tasks, this.state.filters), this.state.sortState)
  }

  public getFilterState = (): TaskFilters => {
    return { ...this.state.filters }
  }

  public setFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]): void => {
    this.state.filters = {
      ...this.state.filters,
      [key]: value,
    }
  }

  public clearFilters = (): void => {
    this.state.filters = this.getDefaultFilters()
  }

  public hasActiveFilters = (): boolean => {
    return Object.values(this.state.filters).some((value: string | null): boolean => value !== null)
  }

  public getSortState = (): TaskSortState | null => {
    return this.state.sortState ? { ...this.state.sortState } : null
  }

  public setSortState = (sortState: TaskSortState | null): void => {
    this.state.sortState = sortState ? { ...sortState } : null
  }

  public clearSort = (): void => {
    this.state.sortState = null
  }

  public setSortFromOptionValue = (value: string): void => {
    if (value.length === 0) {
      this.clearSort()
      return
    }

    const option = TASK_SORT_OPTIONS.find((sortOption: TaskSortOption): boolean => {
      return this.getSortOptionValue(sortOption) === value
    })

    if (!option) {
      return
    }

    this.setSortState({
      key: option.key,
      direction: option.direction,
    })
  }

  public getSortOptionValue = (sortState: TaskSortState): string => {
    return `${sortState.key}:${sortState.direction}`
  }

  public filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    return this.cloneTasks(
      tasks.filter((task: Task): boolean => {
        const matchesPriority = filters.priority === null || task.priority === filters.priority
        const matchesAssignee =
          filters.assignee === null || task.assignees.includes(filters.assignee)
        const matchesStatus = filters.status === null || task.status === filters.status
        const matchesTag =
          filters.tag === null ||
          task.tags.some((tag: string): boolean => tag.toLowerCase() === filters.tag?.toLowerCase())

        return matchesPriority && matchesAssignee && matchesStatus && matchesTag
      }),
    )
  }

  public validateTask = (draft: TaskDraft): TaskValidationResult => {
    const errors: TaskValidationErrors = {}
    const normalizedTitle = draft.title.trim()

    if (normalizedTitle.length === 0) {
      errors.title = 'Title is required.'
    }

    if (draft.dueDate.trim().length === 0) {
      errors.dueDate = 'Due date is required.'
    } else if (this.isPastDate(draft.dueDate)) {
      errors.dueDate = 'Due date cannot be in the past.'
    }

    if (this.normalizeTextList(draft.assignees).length === 0) {
      errors.assignees = 'At least one assignee is required.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  public isOverdue = (task: Task): boolean => {
    return task.status !== 'done' && this.isPastDate(task.dueDate)
  }

  public getAssignees = (): string[] => {
    return Array.from(
      new Set(
        this.state.tasks.flatMap((task: Task): string[] => task.assignees),
      ),
    ).sort()
  }

  public getTags = (): string[] => {
    return Array.from(
      new Set(
        this.state.tasks.flatMap((task: Task): string[] => task.tags),
      ),
    ).sort()
  }

  public getAssigneeInitials = (assignee: string): string => {
    const nameParts = assignee
      .trim()
      .split(/\s+/)
      .filter((part: string): boolean => part.length > 0)

    const firstInitial = nameParts[0]?.[0] ?? ''
    const secondInitial = nameParts[1]?.[0] ?? ''
    const fallbackInitial = assignee.trim()[0] ?? ''
    const initials = `${firstInitial}${secondInitial}` || fallbackInitial

    return initials.toUpperCase()
  }

  public getAvatarTone = (assignee: string): TaskAvatarTone => {
    const toneIndex = this.hashString(assignee) % AVATAR_TONES.length
    const tone = AVATAR_TONES[toneIndex]

    return tone ?? DEFAULT_AVATAR_TONE
  }

  public getTaskAssigneeAvatars = (task: Task): TaskAssigneeAvatar[] => {
    return task.assignees.map((assignee: string): TaskAssigneeAvatar => {
      return {
        initials: this.getAssigneeInitials(assignee),
        label: assignee,
        tone: this.getAvatarTone(assignee),
      }
    })
  }

  public getTaskAssigneeLabel = (task: Task): string => {
    return task.assignees.join(', ')
  }

  public getStatusLabel = (status: TaskStatus, variant: TaskStatusLabelVariant): string => {
    return STATUS_LABELS[variant][status]
  }

  public getKanbanStatusTone = (status: TaskStatus): BaseTone => {
    if (status === 'done') {
      return 'success'
    }

    if (status === 'in-progress') {
      return 'info'
    }

    return 'warning'
  }

  public getPriorityLabel = (priority: TaskPriority): string => {
    return PRIORITY_LABELS[priority]
  }

  public getPriorityTone = (priority: TaskPriority): BaseTone => {
    if (priority === 'high') {
      return 'danger'
    }

    if (priority === 'medium') {
      return 'warning'
    }

    return 'info'
  }

  public getTaskDisplayStatusLabel = (task: Task): string => {
    return TASK_DISPLAY_STATUS_LABELS[task.displayStatus]
  }

  public getTaskDisplayStatusTone = (task: Task): BaseTone => {
    return TASK_DISPLAY_STATUS_TONES[task.displayStatus]
  }

  public formatDisplayDate = (date: string): string => {
    const parsedDate = new Date(`${date}T00:00:00`)
    const day = parsedDate.toLocaleDateString('en-US', { day: '2-digit' })
    const month = parsedDate.toLocaleDateString('en-US', { month: 'short' })
    const year = parsedDate.getFullYear().toString()

    return `${day} ${month} ${year}`
  }

  public formatLongDate = (date: string): string => {
    return this.formatDateValue(date, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  public formatLongDateTime = (date: string): string => {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Invalid date'
    }

    const dateLabel = parsedDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    const timeLabel = parsedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    return `${dateLabel} • ${timeLabel}`
  }

  public formatTime = (date: string): string => {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Invalid time'
    }

    return parsedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  public getTaskActivityEntries = (task: Task): TaskActivityEntry[] => {
    const actor = task.assignees[0] ?? 'A teammate'
    const entries: TaskActivityEntry[] = [
      {
        id: `${task.id}-created`,
        actor,
        action: 'created',
        highlight: task.title,
        time: this.formatLongDateTime(task.createdAt),
      },
      {
        id: `${task.id}-status`,
        actor,
        action: 'set the status to',
        highlight: this.getTaskDisplayStatusLabel(task),
        time: this.formatLongDateTime(task.createdAt),
      },
      {
        id: `${task.id}-priority`,
        actor,
        action: 'set the priority to',
        highlight: this.getPriorityLabel(task.priority),
        time: this.formatLongDateTime(task.createdAt),
      },
    ]

    if (this.isOverdue(task)) {
      entries.push({
        id: `${task.id}-overdue`,
        actor: 'System',
        action: 'flagged this task overdue. It was due',
        highlight: this.formatLongDate(task.dueDate),
        time: '',
      })
    }

    return entries
  }

  public getActiveView = (): TaskView => {
    return this.state.activeView
  }

  public setActiveView = (view: TaskView): void => {
    this.state.activeView = view
    this.writeStorage(ACTIVE_VIEW_STORAGE_KEY, view)
  }

  public isTaskModalOpen = (): boolean => {
    return this.state.taskModal.isOpen
  }

  public getTaskModalMode = (): TaskFormMode => {
    return this.state.taskModal.mode
  }

  public getTaskModalTaskId = (): string | null => {
    return this.state.taskModal.taskId
  }

  public getTaskModalInitialStatus = (): TaskStatus | null => {
    return this.state.taskModal.initialStatus
  }

  public openCreateTask = (status: TaskStatus = 'todo'): void => {
    this.state.taskModal = {
      isOpen: true,
      mode: 'create',
      taskId: null,
      initialStatus: status,
    }
  }

  public openEditTask = (taskId: string): void => {
    this.state.taskModal = {
      isOpen: true,
      mode: 'edit',
      taskId,
      initialStatus: null,
    }
  }

  public closeTaskModal = (): void => {
    this.state.taskModal = {
      ...this.state.taskModal,
      isOpen: false,
    }
  }

  public openTaskDetail = (taskId: string): void => {
    this.state.detailTaskId = taskId
  }

  public closeTaskDetail = (): void => {
    this.state.detailTaskId = null
  }

  public getDetailTask = (): Task | null => {
    return this.state.detailTaskId === null ? null : this.getTask(this.state.detailTaskId)
  }

  public editTaskFromDetail = (taskId: string): void => {
    this.closeTaskDetail()
    this.openEditTask(taskId)
  }

  public deleteTaskFromDetail = (taskId: string): void => {
    this.closeTaskDetail()
    this.openDeleteTask(taskId)
  }

  public openDeleteTask = (taskId: string): void => {
    this.state.pendingDeleteTaskId = taskId
  }

  public closeDeleteDialog = (): void => {
    this.state.pendingDeleteTaskId = null
  }

  public hasPendingDeleteTask = (): boolean => {
    return this.state.pendingDeleteTaskId !== null
  }

  public getDeleteDialogMessage = (): string => {
    if (this.state.pendingDeleteTaskId === null) {
      return ''
    }

    const task = this.getTask(this.state.pendingDeleteTaskId)

    return task
      ? `"${task.title}" will be permanently removed. This action cannot be undone.`
      : 'This task will be permanently removed. This action cannot be undone.'
  }

  public confirmDeleteTask = (): void => {
    if (this.state.pendingDeleteTaskId !== null) {
      this.deleteTask(this.state.pendingDeleteTaskId)
    }

    this.closeDeleteDialog()
  }

  public isTaskSelected = (taskId: string): boolean => {
    return this.state.selectedTaskIds.has(taskId)
  }

  public setTaskSelected = (taskId: string, selected: boolean): void => {
    if (selected) {
      this.state.selectedTaskIds.add(taskId)
      return
    }

    this.state.selectedTaskIds.delete(taskId)
  }

  // Private helpers: standard methods keep implementation details separate from the public API.
  private readActiveView(): TaskView {
    const storedView = this.readStorage(ACTIVE_VIEW_STORAGE_KEY)

    if (storedView === 'board' || storedView === 'list') {
      return storedView
    }

    return DEFAULT_TASK_VIEW
  }

  private normalizeDraft(draft: TaskDraft): TaskDraft {
    return {
      title: draft.title.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      dueDate: draft.dueDate.trim(),
      assignees: this.normalizeTextList(draft.assignees),
      status: draft.status,
      displayStatus: draft.displayStatus,
      tags: draft.tags
        .map((tag: string): string => tag.trim())
        .filter((tag: string): boolean => tag.length > 0),
    }
  }

  private getDefaultFilters(): TaskFilters {
    return {
      assignee: null,
      priority: null,
      status: null,
      tag: null,
    }
  }

  private sortTasks(tasks: Task[], sortState: TaskSortState | null): Task[] {
    const clonedTasks = this.cloneTasks(tasks)

    if (sortState === null) {
      return clonedTasks
    }

    return clonedTasks.sort((firstTask: Task, secondTask: Task): number => {
      const result = this.compareTasks(firstTask, secondTask, sortState.key)

      return sortState.direction === 'asc' ? result : -result
    })
  }

  private compareTasks(firstTask: Task, secondTask: Task, key: TaskSortKey): number {
    if (key === 'dueDate') {
      return this.getDateTime(firstTask.dueDate) - this.getDateTime(secondTask.dueDate)
    }

    if (key === 'createdAt') {
      return new Date(firstTask.createdAt).getTime() - new Date(secondTask.createdAt).getTime()
    }

    if (key === 'priority') {
      return PRIORITY_WEIGHT[firstTask.priority] - PRIORITY_WEIGHT[secondTask.priority]
    }

    if (key === 'status') {
      return this.getStatusWeight(firstTask.status) - this.getStatusWeight(secondTask.status)
    }

    if (key === 'assignee') {
      return this.getTaskAssigneeLabel(firstTask).localeCompare(this.getTaskAssigneeLabel(secondTask))
    }

    return firstTask.title.localeCompare(secondTask.title)
  }

  private getStatusWeight(status: TaskStatus): number {
    if (status === 'todo') {
      return 1
    }

    if (status === 'in-progress') {
      return 2
    }

    return 3
  }

  private getDefaultTaskDraft(status: TaskStatus): TaskDraft {
    return {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: this.getTodayDate(),
      assignees: [DEFAULT_ASSIGNEE],
      status,
      displayStatus: this.getDefaultTaskDisplayStatus(status),
      tags: [],
    }
  }

  private getDefaultTaskDisplayStatus(status: TaskStatus): TaskDisplayStatus {
    if (status === 'done') {
      return 'completed'
    }

    if (status === 'in-progress') {
      return 'in-research'
    }

    return 'not-started'
  }

  private createDraftFromFormState(formState: TaskFormState): TaskDraft {
    return {
      title: formState.title,
      description: formState.description,
      priority: formState.priority,
      dueDate: formState.dueDate,
      assignees: this.parseTextList(formState.assigneesInput),
      status: formState.status,
      displayStatus: formState.displayStatus,
      tags: this.parseTextList(formState.tagsInput),
    }
  }

  private cloneTasks(tasks: Task[]): Task[] {
    return tasks.map((task: Task): Task => this.cloneTask(task))
  }

  private cloneTask(task: Task): Task {
    return {
      ...task,
      assignees: [...task.assignees],
      tags: [...task.tags],
    }
  }

  private parseTextList(value: string): string[] {
    return this.normalizeTextList(value.split(','))
  }

  private normalizeTextList(values: string[]): string[] {
    return Array.from(
      new Set(
        values
          .map((value: string): string => value.trim())
          .filter((value: string): boolean => value.length > 0),
      ),
    )
  }

  private createTaskId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }

    return `task-${Date.now().toString()}`
  }

  private isPastDate(date: string): boolean {
    return this.getDateTime(date) < this.getDateTime(this.getTodayDate())
  }

  private getDateTime(date: string): number {
    return new Date(`${date}T00:00:00`).getTime()
  }

  private formatDateValue(date: string, options: Intl.DateTimeFormatOptions): string {
    const parsedDate = new Date(date.includes('T') ? date : `${date}T00:00:00`)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Invalid date'
    }

    return parsedDate.toLocaleDateString('en-US', options)
  }

  private getTodayDate(): string {
    return new Date().toISOString().slice(0, 10)
  }

  private hashString(value: string): number {
    return Array.from(value).reduce((hash: number, character: string): number => {
      return hash + character.charCodeAt(0)
    }, 0)
  }

  private readStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null
    }

    return localStorage.getItem(key)
  }

  private writeStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') {
      return
    }

    localStorage.setItem(key, value)
  }
}
