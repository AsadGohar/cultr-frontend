/**
 * Query keys for TanStack Query
 * Using a factory pattern to ensure consistent and type-safe query keys
 */

export const queryKeys = {
  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    me: (userId?: string) =>
      userId
        ? ([...queryKeys.users.all, "me", userId] as const)
        : ([...queryKeys.users.all, "me"] as const),
    profileById: (userId: string) =>
      [...queryKeys.users.all, "profile-by-id", userId] as const,
    confidentialDetails: (userId?: string) =>
      userId
        ? ([...queryKeys.users.all, "confidential-details", userId] as const)
        : ([...queryKeys.users.all, "confidential-details"] as const),
    employees: (params?: Record<string, unknown>) =>
      [...queryKeys.users.all, "employees", { params }] as const,
    notes: () => [...queryKeys.users.all, "notes"] as const,
    department: (departmentId: string) =>
      [...queryKeys.users.all, "department", departmentId] as const,
  },

  // Projects
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.projects.lists(), { filters }] as const,
    filtered: (params: Record<string, unknown>) =>
      [...queryKeys.projects.all, "filtered", { params }] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
    details: (id: string) =>
      [...queryKeys.projects.all, "details", id] as const,
    files: (projectId: string) =>
      [...queryKeys.projects.all, "files", projectId] as const,
    activityLog: (projectId: string) =>
      [...queryKeys.projects.all, "activity-log", projectId] as const,
    timelineTasks: (projectId: string) =>
      [...queryKeys.projects.all, "timeline-tasks", projectId] as const,
    threads: (projectId: string, params?: Record<string, unknown>) =>
      [...queryKeys.projects.all, "threads", projectId, { params }] as const,
    threadReplies: (threadId: string, params?: Record<string, unknown>) =>
      [
        ...queryKeys.projects.all,
        "thread-replies",
        threadId,
        { params },
      ] as const,
    clientNames: (params?: Record<string, unknown>) =>
      [...queryKeys.projects.all, "client-names", { params }] as const,
    locations: (params?: Record<string, unknown>) =>
      [...queryKeys.projects.all, "locations", { params }] as const,
    presentations: (projectId: string) =>
      [...queryKeys.projects.all, "presentations", projectId] as const,
    assignees: (projectId: string) =>
      [...queryKeys.projects.all, "assignees", projectId] as const,
    supplierPayments: (projectId: string) =>
      [...queryKeys.projects.all, "supplier-payments", projectId] as const,
    supplierPayment: (id: string) =>
      [...queryKeys.projects.all, "supplier-payment", id] as const,
    cashPayments: (projectId: string) =>
      [...queryKeys.projects.all, "cash-payments", projectId] as const,
    cashPayment: (id: string) =>
      [...queryKeys.projects.all, "cash-payment", id] as const,
    perDiemRequests: (projectId: string) =>
      [...queryKeys.projects.all, "per-diem-requests", projectId] as const,
    boq: (projectId: string) =>
      [...queryKeys.projects.all, "boq", projectId] as const,
    boqVersions: (boqId: string) =>
      [...queryKeys.projects.all, "boq-versions", boqId] as const,
    internalQuotation: (projectId: string) =>
      [...queryKeys.projects.all, "internal-quotation", projectId] as const,
    externalQuotation: (projectId: string) =>
      [...queryKeys.projects.all, "external-quotation", projectId] as const,
  },

  // Clients (dashboard client database)
  clients: {
    all: ["clients"] as const,
    lists: () => [...queryKeys.clients.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.clients.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.clients.all, "detail", id] as const,
    history: (id: string, params?: Record<string, unknown>) =>
      [...queryKeys.clients.all, "history", id, { params }] as const,
    interactions: (id: string, params?: Record<string, unknown>) =>
      [...queryKeys.clients.all, "interactions", id, { params }] as const,
  },

  // Tasks
  tasks: {
    all: ["tasks"] as const,
    user: () => [...queryKeys.tasks.all, "user"] as const,
    weeklyDeadlines: (weekStart?: string, weekEnd?: string) =>
      [
        ...queryKeys.tasks.all,
        "weekly-deadlines",
        { weekStart, weekEnd },
      ] as const,
    timeLogs: {
      active: () => [...queryKeys.tasks.all, "time-logs", "active"] as const,
      paused: () => [...queryKeys.tasks.all, "time-logs", "paused"] as const,
      byTaskAssignee: (taskAssigneeId: string) =>
        [
          ...queryKeys.tasks.all,
          "time-logs",
          "task-assignee",
          taskAssigneeId,
        ] as const,
    },
  },

  // Auth
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    analytics: (dateRange?: string) =>
      [...queryKeys.dashboard.all, "analytics", { dateRange }] as const,
    weeklyProjects: (params?: { startDate?: string; endDate?: string }) =>
      [...queryKeys.dashboard.all, "weekly-projects", { params }] as const,
    weeklyEvents: (params?: { startDate?: string; endDate?: string }) =>
      [...queryKeys.dashboard.all, "weekly-events", { params }] as const,
    upcomingEvents: (params?: { page?: number; limit?: number }) =>
      [...queryKeys.dashboard.all, "upcoming-events", { params }] as const,
    projectMetrics: (params?: { month?: number; year?: number }) =>
      [...queryKeys.dashboard.all, "project-metrics", { params }] as const,
    projectMetricsWeekly: (params?: { startDate?: string; endDate?: string }) =>
      [
        ...queryKeys.dashboard.all,
        "project-metrics-weekly",
        { params },
      ] as const,
    weeklyPerformance: () =>
      [...queryKeys.dashboard.all, "weekly-performance"] as const,
  },

  // Calendar
  calendar: {
    all: ["calendar"] as const,
    team: (startDate: string, endDate: string) =>
      [...queryKeys.calendar.all, "team", { startDate, endDate }] as const,
    my: (startDate: string, endDate: string) =>
      [...queryKeys.calendar.all, "my", { startDate, endDate }] as const,
    events: (month: string, team: string) =>
      [...queryKeys.calendar.all, "events", { month, team }] as const,
  },

  // Settings
  settings: {
    all: ["settings"] as const,
    user: () => [...queryKeys.settings.all, "user"] as const,
    system: () => [...queryKeys.settings.all, "system"] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.notifications.all, "list", { filters }] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
    detail: (id: string) =>
      [...queryKeys.notifications.all, "detail", id] as const,
  },

  // Requests
  requests: {
    all: ["requests"] as const,
    lists: () => [...queryKeys.requests.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.requests.lists(), params] as const,
    leaveInfo: (year?: number, userId?: string) =>
      [...queryKeys.requests.all, "leave-info", { year, userId }] as const,
    details: (requestId?: string, requestType?: string) =>
      [
        ...queryKeys.requests.all,
        "details",
        { requestId, requestType },
      ] as const,
    comments: (
      requestId: string,
      requestType: string,
      params?: Record<string, unknown>
    ) =>
      [
        ...queryKeys.requests.all,
        "comments",
        requestId,
        requestType,
        { params },
      ] as const,
  },

  // Payslips
  payslips: {
    all: ["payslips"] as const,
    lists: () => [...queryKeys.payslips.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.payslips.lists(), params] as const,
  },

  // Members (Organizational Chart)
  members: {
    all: ["members"] as const,
    organizational: () => [...queryKeys.members.all, "organizational"] as const,
    allEmployees: (params?: Record<string, unknown>) =>
      [...queryKeys.members.all, "all-employees", { params }] as const,
    entities: (params?: Record<string, unknown>) =>
      [...queryKeys.members.all, "entities", { params }] as const,
    locationSearch: (params?: Record<string, unknown>) =>
      [...queryKeys.members.all, "locations", { params }] as const,
    roles: () => [...queryKeys.members.all, "roles"] as const,
    departmentsList: () =>
      [...queryKeys.members.all, "departments-list"] as const,
    search: (query: string) =>
      [...queryKeys.members.all, "search", { query }] as const,
    department: (departmentId: string) =>
      [...queryKeys.members.all, "department", departmentId] as const,
  },

  // Travel
  travel: {
    all: ["travel"] as const,
    lists: () => [...queryKeys.travel.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.travel.lists(), { params }] as const,
    detail: (id: string) => [...queryKeys.travel.all, "detail", id] as const,
  },

  // Locations
  locations: {
    all: ["locations"] as const,
    airports: () => [...queryKeys.locations.all, "airports"] as const,
    active: () => [...queryKeys.locations.all, "active"] as const,
    search: (query: string) =>
      [...queryKeys.locations.all, "search", { query }] as const,
  },

  // User Files
  userFiles: {
    all: ["userFiles"] as const,
    folders: () => [...queryKeys.userFiles.all, "folders"] as const,
    recentlyViewed: (params?: Record<string, unknown>) =>
      [...queryKeys.userFiles.all, "recently-viewed", { params }] as const,
    folderFiles: (folderId: string, params?: Record<string, unknown>) =>
      [
        ...queryKeys.userFiles.all,
        "folder-files",
        folderId,
        { params },
      ] as const,
  },

  // Holidays
  holidays: {
    all: ["holidays"] as const,
    lists: () => [...queryKeys.holidays.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.holidays.lists(), { filters }] as const,
    detail: (id: string) => [...queryKeys.holidays.all, "detail", id] as const,
  },

  // Capacity Planner
  capacityPlanner: {
    all: ["capacityPlanner"] as const,
    base: (params: Record<string, unknown>) =>
      [...queryKeys.capacityPlanner.all, { params }] as const,
    memberAlerts: (params: Record<string, unknown>) =>
      [...queryKeys.capacityPlanner.all, "member-alerts", { params }] as const,
    memberWeeklyDetails: (params: Record<string, unknown>) =>
      [
        ...queryKeys.capacityPlanner.all,
        "member-weekly-details",
        { params },
      ] as const,
    dailyBreakdown: (params: Record<string, unknown>) =>
      [
        ...queryKeys.capacityPlanner.all,
        "daily-breakdown",
        { params },
      ] as const,
    upcomingDeadlines: (params: Record<string, unknown>) =>
      [
        ...queryKeys.capacityPlanner.all,
        "upcoming-deadlines",
        { params },
      ] as const,
    recurringNonProjectTime: () =>
      [...queryKeys.capacityPlanner.all, "recurring-non-project-time"] as const,
  },
  // Suppliers
  suppliers: {
    all: ["suppliers"] as const,
    lists: () => [...queryKeys.suppliers.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      filters
        ? ([...queryKeys.suppliers.lists(), { filters }] as const)
        : ([...queryKeys.suppliers.lists()] as const),
    details: () => [...queryKeys.suppliers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.suppliers.details(), id] as const,
  },

  // Supplier Categories
  supplierCategories: {
    all: ["supplierCategories"] as const,
    lists: () => [...queryKeys.supplierCategories.all, "list"] as const,
    list: () => [...queryKeys.supplierCategories.lists()] as const,
    details: () => [...queryKeys.supplierCategories.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.supplierCategories.details(), id] as const,
  },

  // Inventory
  inventory: {
    all: ["inventory"] as const,
    lists: () => [...queryKeys.inventory.all, "list"] as const,
    list: (params?: {
      page?: number;
      limit?: number;
      filters?: Record<string, unknown>;
    }) =>
      params
        ? ([...queryKeys.inventory.lists(), params] as const)
        : ([...queryKeys.inventory.lists()] as const),
    details: () => [...queryKeys.inventory.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.inventory.details(), id] as const,
  },

  // Assets
  assets: {
    all: ["assets"] as const,
    lists: () => [...queryKeys.assets.all, "list"] as const,
    list: (params?: {
      page?: number;
      limit?: number;
      filters?: Record<string, unknown>;
    }) =>
      params
        ? ([...queryKeys.assets.lists(), params] as const)
        : ([...queryKeys.assets.lists()] as const),
    stats: () => [...queryKeys.assets.all, "stats"] as const,
    details: () => [...queryKeys.assets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.assets.details(), id] as const,
  },

  // Purchase Orders
  purchaseOrders: {
    all: ["purchaseOrders"] as const,
    lists: () => [...queryKeys.purchaseOrders.all, "list"] as const,
    list: () => [...queryKeys.purchaseOrders.lists()] as const,
    groupedByMonth: () =>
      [...queryKeys.purchaseOrders.all, "grouped-by-month"] as const,
    groupedByProject: (projectId: string) =>
      [
        ...queryKeys.purchaseOrders.all,
        "grouped-by-project",
        projectId,
      ] as const,
    details: () => [...queryKeys.purchaseOrders.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.purchaseOrders.details(), id] as const,
  },

  // Quotations
  quotations: {
    all: ["quotations"] as const,
    groupedByProject: (projectId: string) =>
      [...queryKeys.quotations.all, "grouped-by-project", projectId] as const,
  },

  // Invoices
  invoices: {
    all: ["invoices"] as const,
    lists: () => [...queryKeys.invoices.all, "list"] as const,
    list: () => [...queryKeys.invoices.lists()] as const,
    details: () => [...queryKeys.invoices.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },

  // Analytics
  analytics: {
    all: ["analytics"] as const,
    insights: (filters?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "insights", { filters }] as const,
    rawGrouped: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "raw", "grouped", { params }] as const,
    rawTable: (params?: Record<string, unknown>) =>
      [...queryKeys.analytics.all, "raw", "table", { params }] as const,
  },

  // Permissions (user-scoped key prevents cross-user cache reuse on same-browser login)
  permissions: {
    all: ["permissions"] as const,
    effective: (userId?: string) =>
      [
        ...queryKeys.permissions.all,
        "effective",
        userId ?? "anonymous",
      ] as const,
  },

  // Search
  search: {
    all: ["search"] as const,
    global: (query: string) =>
      [...queryKeys.search.all, "global", { query }] as const,
  },

  // QuickBooks (Finance)
  qb: {
    all: ["qb"] as const,
    status: () => [...queryKeys.qb.all, "status"] as const,
    commissionList: (params?: { date?: string; location?: string }) =>
      [...queryKeys.qb.all, "commission-list", { params }] as const,
    transactionHistory: (params?: {
      startDate?: string;
      endDate?: string;
      transactionType?: string;
    }) => [...queryKeys.qb.all, "transaction-history", { params }] as const,
    receivables: (params?: { date?: string; location?: string }) =>
      [...queryKeys.qb.all, "receivables", { params }] as const,
    payables: (params?: { date?: string; location?: string }) =>
      [...queryKeys.qb.all, "payables", { params }] as const,
    profitLoss: (params?: { date?: string }) =>
      [...queryKeys.qb.all, "profit-loss", { params }] as const,
    dashboard: (params?: {
      startDate?: string;
      endDate?: string;
      quarter?: string;
      year?: string;
    }) => [...queryKeys.qb.all, "dashboard", { params }] as const,
    topClientsComparison: (params?: { year?: number; limit?: number }) =>
      [...queryKeys.qb.all, "top-clients-comparison", { params }] as const,
  },

  payroll: {
    all: ["payroll"] as const,
    periods: (params?: { month?: number; year?: number }) =>
      [...queryKeys.payroll.all, "periods", { params }] as const,
    period: (id: string) => [...queryKeys.payroll.all, "period", id] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
