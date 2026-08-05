/* eslint-disable sonarjs/no-hardcoded-passwords */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/signup",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASS: "/auth/forgot-password",
    RESET_PASS: "/auth/reset-password",
    GOOGLE: "/auth/login-google",
    MICROSOFT: "/auth/login-microsoft",
    VERIFY_QR: "/auth/verify-2fa-signup",
    CONFIRM_RECOVERY_CODE: "/auth/confirm-recovery-code",
    VERIFY_2FA: "/auth/verify-two-factor-and-login",
    RELINK_AUTHENTICATOR: "/auth/relink-authenticator",
    VERIFY_RELINK_AUTHENTICATOR: "/auth/verify-relink-authenticator",
    CHECK_ONBOARDING_STATUS: "/auth/check-onboarding-status",
  },
  USERS: {
    PROFILE: "/users/my-profile",
    PROFILE_BY_ID: "/users/profile-by-id",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
    UPLOAD_PROFILE_IMAGE: "/users/profile/upload-image",
    UPLOAD_PROFILE_IMAGE_EXTERNAL: "/users/profile/upload-image-external",
    CONFIDENTIAL_DETAILS: "/users/confidential-details",
    EMPLOYEES: "/users/search",
    UPDATE_PROFILE: "/users/profile",
    CREATE: "/users/create",
    ADD_RESPONSIBILITY: "/users/responsibilities/add",
    PASSWORD: "/users/password",
    DEPARTMENT: "/users/users-for-leader",
    NOTES: {
      GET: "/users/notes",
      UPDATE: "/users/notes",
    },
  },

  MEMBERS: {
    ORGANIZATIONAL: "/users/organizational-hierarchy",
    ALL_EMPLOYEES: "/users/all-employees",
    SEARCH: "/members/search",
    DEPARTMENT: "/members/department/:id",
    DEPARTMENTS_LIST: "/departments",
    UPDATE: "/members/:id",
    DELETE: "/members/:id",
    ENTITIES: "/users/entities",
    LOCATIONS: "/users/search/locations",
    ROLES: "/roles",
  },

  ACCESS_CONTROL: {
    PEOPLE: "/access-control/people",
    PERSON_ACCESS: (userId: string) =>
      `/access-control/people/${userId}/access`,
    ROLES: "/access-control/roles",
    ROLE_ACCESS: (roleId: string) => `/access-control/roles/${roleId}/access`,
    ROLE_PEOPLE: (roleId: string) => `/access-control/roles/${roleId}/people`,
    DEPARTMENTS: "/access-control/departments",
    DEPARTMENT_ACCESS: (departmentId: string) =>
      `/access-control/departments/${departmentId}/access`,
    DEPARTMENT_PEOPLE: (departmentId: string) =>
      `/access-control/departments/${departmentId}/people`,
    PERMISSIONS: "/access-control/permissions",
    WHO_HAS: (permissionId: string) =>
      `/access-control/permissions/${permissionId}/who-has`,
  },

  PAYSLIPS: {
    LIST: "/payslips/user",
  },
  PAYROLL: {
    PERIODS: "/payroll/periods",
    OFFCYCLE_PRIOR_MONTH: "/payroll/periods/offcycle",
    PERIOD: (id: string) => `/payroll/periods/${id}`,
    READY_FOR_FINANCE: "/payroll/periods/ready-for-finance",
    EMPLOYEE_LINE: (lineId: string) => `/payroll/employee-lines/${lineId}`,
    DEDUCTIONS: (employeePayrollId: string) =>
      `/payroll/employee-lines/${employeePayrollId}/deductions`,
    DEDUCTION: (deductionId: string) => `/payroll/deductions/${deductionId}`,
    SUBMIT: (id: string) => `/payroll/periods/${id}/submit`,
    SUBMIT_AND_APPROVE: (id: string) =>
      `/payroll/periods/${id}/submit-and-approve`,
    APPROVE: (id: string) => `/payroll/periods/${id}/approve`,
    RELEASE: (id: string) => `/payroll/periods/${id}/release`,
    REJECT_BY_FINANCE: (id: string) =>
      `/payroll/periods/${id}/reject-by-finance`,
  },
  POSTS: {
    LIST: "/posts",
    CREATE: "/posts",
    UPDATE: "/posts/:id",
    DELETE: "/posts/:id",
  },
  PROJECTS: {
    LIST: "/projects",
    CREATE: "/projects",
    GET_BY_ID: "/projects/:id",
    UPDATE: "/projects/:id",
    DELETE: "/projects/:id",
    FILTERED: "/projects/filtered",
    UNASSIGNED: "/projects/unassigned",
    ACTIVITY_LOG: "/activity-logs/project/:id",
    TIMELINE_TASKS: "/tasks/project/:id",
    PREVIEW_TASK_ASSIGNMENTS: "/projects/:id/preview-task-assignments",
    CONFIRM_TASK_ASSIGNMENTS: "/projects/:id/confirm-task-assignments",
    GENERATE_PRESENTATION_DATA: "/projects/:id/generate-presentation-data",
    DOWNLOAD_PRESENTATION_URLS: "/projects/:id/presentations/download-urls",
  },
  PROJECT_ASSIGNEES: {
    ADD_MULTIPLE: "/project-assignees/multiple",
    REMOVE_MULTIPLE: "/project-assignees/remove-multiple",
    GET_BY_PROJECT: "/project-assignees/project/:projectId",
    UPDATE_ROLE: "/project-assignees/role",
  },
  PROJECT_SUPPLIERS: {
    LIST: "/projects/:projectId/suppliers",
    ADD: "/projects/:projectId/suppliers",
    RATE: "/projects/:projectId/suppliers/:supplierId/rating",
    REMOVE: "/projects/:projectId/suppliers/:supplierId",
  },
  DASHBOARD: {
    WEEKLY_PROJECTS: "/projects/weekly-dashboard",
    WEEKLY_EVENTS: "/tasks/weekly-dashboard",
    UPCOMING_EVENTS: "/upcoming-events",
    PROJECT_METRICS: "/projects/metrics",
    PROJECT_METRICS_WEEKLY: "/projects/metrics/weekly",
  },
  THREADS: {
    CREATE: "/threads",
    GET_BY_PROJECT: "/threads/project/:id",
    CREATE_REPLY: "/threads/:id/replies",
    GET_REPLIES: "/threads/:id/replies",
    EDIT: "/threads/:id",
    DELETE: "/threads/:id",
  },
  REQUEST_COMMENTS: {
    LIST: "/request-comments/:requestType/:requestId",
    CREATE: "/request-comments/:requestType/:requestId",
  },
  TASKS: {
    CREATE: "/tasks",
    UPDATE: "/tasks",
    USER: "/tasks/user",
    WEEKLY_DEADLINES: "/tasks/weekly-deadlines",
    TIME_LOGS: {
      START: "/tasks/time-logs/start",
      PAUSE: "/tasks/time-logs/pause",
      RESUME: "/tasks/time-logs/resume",
      STOP: "/tasks/time-logs/stop",
      ACTIVE: "/tasks/time-logs/active",
      PAUSED: "/tasks/time-logs/paused",
      BY_TASK_ASSIGNEE: "/tasks/time-logs/task-assignee/:taskAssigneeId",
      EDIT: "/tasks/time-logs/edit",
      WEEKLY_PERFORMANCE: "/tasks/time-logs/weekly-performance",
    },
  },
  CLIENT_NAMES: "/projects/client-names",
  MY_CLIENT_NAMES: "/projects/my-client-names",
  CLIENTS: {
    LIST: "/clients",
    GET_BY_ID: "/clients/:id",
    CREATE: "/clients",
    UPDATE: "/clients/:id",
    DELETE: "/clients/:id",
    HISTORY: "/clients/:id/history",
    INTERACTIONS: "/clients/:id/interactions",
    CONTACTS: "/clients/:id/contacts",
    POCS: "/clients/:id/pocs",
    UPLOAD_LOGO: "/clients/upload-logo",
  },
  LOCATIONS: {
    SEARCH: "/brief-locations/search",
    CREATE: "/brief-locations",
    USAGE: (usage: "user" | "project" | "supplier" | "asset") =>
      `/locations/usage/${usage}`,
    AIRPORTS: "/locations/airports",
    ACTIVE: "/locations/active",
  },
  WEATHER: {
    CURRENT: "/weather/current",
    FORECAST: "/weather/forecast",
  },
  REQUESTS: {
    LIST: "/requests",
    IT: "/requests/it",
    HR: "/requests/hr",
    HR_LIST: "/requests/hr-list",
    LEAVE: "/requests/leave",
    PER_DIEM: "/requests/per-diem",
    PER_DIEM_BY_PROJECT: "/requests/per-diem/project/:projectId",
    CANCEL: "/requests/cancel",
    LEAVE_INFO: "/requests/leave-info",
    UPDATE_STATUS: "/requests/update-status",
    SALARY_ADJUSTMENT_NON_SALARY: "/requests/salary-adjustment/non-salary",
    SALARY_ADJUSTMENT: "/requests/salary-adjustment",
    UPDATE_SALARY_ADJUSTMENT: "/requests/salary-adjustment",
    SALARY_CERTIFICATE: "/requests/salary-certificate",
    ANNUAL_TICKET: "/requests/annual-ticket",
    DETAILS: "/requests/details",
  },
  MONTHLY_APPROVALS: {
    UPDATE: "/monthly-approvals/:id",
  },
  CALENDAR: {
    TEAM: "/users/calendar/team",
    MY: "/users/calendar/my",
    EVENTS: "/users/calendar/events",
    ASSIGN_PROJECT_CALENDAR: "/tasks/calendar/assign-tasks",
    EDIT_TASK: "/tasks/calendar/edit-task",
    DRAG_DROP: "/tasks/calendar/drag-drop",
    UPDATE_TASK_TIME: "/tasks/calendar/update-task-time",
    REMOVE_USER: "/tasks/remove-user",
  },
  TRAVEL: {
    CREATE: "/travel",
    UPDATE: "/travel/:id",
    DELETE: "/travel/:id",
  },
  USER_FILES: {
    FOLDERS: "/user-folders",
    UPLOAD: "/user-files/upload",
    RECENTLY_VIEWED: "/user-files/recently-viewed",
    FOLDER_FILES: "/user-files/folder/list",
    VIEW_TRACK: "/user-files",
    DELETE_FILE: "/user-files",
    DELETE_FOLDER: "/user-folders",
    DOWNLOAD_FOLDER: "/user-folders",
  },
  FEEDBACK: {
    EMPLOYEE_OF_THE_MONTH: "/employee-of-the-month/my-votes",
    EMPLOYEE_OF_THE_MONTH_RESULTS: "/employee-of-the-month/results",
    EMPLOYEE_OF_THE_MONTH_CAST_VOTE: "/employee-of-the-month/cast-vote",
    CLIENT_SURVEY_WITH_PROJECT: (projectId: string) =>
      `/feedback/client-survey/${projectId}`,
    CLIENT_SURVEY_QUESTIONS: (projectId: string) =>
      `/client-feedback/questions/project/${projectId}`,
    CLIENT_SURVEY_SUBMIT: "/client-feedback",
    CLIENT_FEEDBACK_RESPONSES: "/client-feedback",
  },
  HOLIDAYS: {
    LIST: "/holidays",
    CREATE: "/holidays",
    UPDATE: "/holidays/:id",
    DELETE: "/holidays/:id",
  },
  CAPACITY_PLANNER: {
    MEMBER_ALERTS: "/capacity-planner/member-alerts",
    MEMBER_WEEKLY_DETAILS: "/capacity-planner/member-weekly-details",
    DAILY_BREAKDOWN: "/capacity-planner/daily-breakdown",
    UPCOMING_DEADLINES: "/capacity-planner/upcoming-deadlines",
    RECURRING_NON_PROJECT_TIME: "/recurring-non-project-time",
    ALL: "/capacity-planner",
  },
  ANALYTICS: {
    INSIGHTS: "/analytics/insights",
    RAW: "/analytics/raw",
  },
  ROLE_RESPONSIBILITIES: {
    UPDATE: "/role-responsibilities/:id",
    DELETE: "/role-responsibilities/:id",
  },
  MILESTONES: {
    ADD: "/milestones/add",
    UPDATE: "/milestones/:id",
    DELETE: "/milestones/:id",
  },
  SUPPLIERS: {
    LIST: "/suppliers",
    GET_BY_ID: "/suppliers/:id",
    CREATE: "/suppliers",
    UPDATE: "/suppliers/:id",
    DELETE: "/suppliers/:id",
    UPLOAD_AVATAR: "/suppliers/:id/upload-avatar",
  },
  SUPPLIER_CATEGORIES: {
    LIST: "/supplier-categories",
    GET_BY_ID: "/supplier-categories/:id",
    CREATE: "/supplier-categories",
    UPDATE: "/supplier-categories/:id",
    DELETE: "/supplier-categories/:id",
  },
  QUOTATIONS: {
    BULK: "/quotations/bulk",
    EXTRACTION_JOB: "/quotations/extraction-jobs/:jobId",
    GROUPED_BY_PROJECT: "/quotations/project/:projectId/grouped",
  },
  INVENTORY: {
    LIST: "/inventory",
    GET_BY_ID: "/inventory/:id",
    CREATE: "/inventory",
    UPDATE: "/inventory/:id",
    DELETE: "/inventory/:id",
    UPLOAD_IMAGE: "/inventory/:id/image",
  },
  ASSETS: {
    LIST: "/assets",
    GET_BY_ID: "/assets/:id",
    CREATE: "/assets",
    UPDATE: "/assets/:id",
    DELETE: "/assets/:id",
    STATS: "/assets/stats",
  },
  PURCHASE_ORDERS: {
    LIST: "/purchase-orders",
    GET_BY_ID: "/purchase-orders/:id",
    CREATE: "/purchase-orders",
    UPDATE: "/purchase-orders/:id",
    DELETE: "/purchase-orders/:id",
    BULK: "/purchase-orders/bulk",
    GENERATE_FROM_QUOTATION: "/purchase-orders/generate/quotation/:projectId",
    GROUPED_BY_PROJECT: "/purchase-orders/project/:projectId/grouped",
    GROUPED_BY_MONTH: "/purchase-orders/grouped-by-month",
    IMPORT_EXCEL: "/purchase-orders/import-excel",
  },
  INVOICES: {
    CREATE: "/invoices",
  },
  PERMISSIONS: {
    USER_EFFECTIVE: "/permissions/user/effective",
  },
  SEARCH: {
    GLOBAL: "/search",
  },
  ROLES: {
    SEARCH: "/roles/search",
    CREATE: "/roles",
    UPDATE: "/roles/:id",
    DELETE: "/roles/:id",
    GET_BY_ID: "/roles/:id",
    FILTER_OPTIONS: "/roles/filter-options",
  },
  BOQ: {
    GET_BY_PROJECT: "/boq/project/:projectId",
    SAVE: "/boq/project/:projectId",
    VERSIONS: "/boq/:boqId/versions",
    RESTORE_VERSION: "/boq/:boqId/versions/:versionId/restore",
    SUBMIT_REVIEW: "/boq/:boqId/submit-review",
    UPDATE_APPROVAL: "/boq/approvals/:approvalId",
  },
  INTERNAL_QUOTATIONS: {
    GET_BY_PROJECT: "/internal-quotations/project/:projectId",
    GET_EXTERNAL_BY_PROJECT: "/internal-quotations/external/project/:projectId",
    GENERATE_BY_PROJECT: "/internal-quotations/generate/project/:projectId",
  },
  FINANCE: {
    SUPPLIER_PAYMENTS: {
      LIST_BY_PROJECT: "/finance/supplier-payments/project/:projectId",
      GET_BY_ID: "/finance/supplier-payments/:id",
      CREATE: "/finance/supplier-payments",
      UPDATE: "/finance/supplier-payments/:id",
      DELETE: "/finance/supplier-payments/:id",
    },
    CASH_PAYMENTS: {
      LIST_BY_PROJECT: "/finance/cash-payments/project/:projectId",
      GET_BY_ID: "/finance/cash-payments/:id",
      CREATE: "/finance/cash-payments",
      UPDATE: "/finance/cash-payments/:id",
      DELETE: "/finance/cash-payments/:id",
    },
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  THEME: "app_theme",
  USER_DATA: "auth_user",
  FILE_VIEW_PREFERENCE: "userFiles_viewPreference",
  SIDEBAR_COLLAPSED: "hailo-sidebar-collapsed",
  EMPLOYEE_TABLE_COLUMN_VISIBILITY: "employee-table-column-visibility",
  PAYROLL_TABLE_COLUMN_VISIBILITY_DRAFT:
    "payroll-table-column-visibility-draft",
  PAYROLL_TABLE_COLUMN_VISIBILITY_RELEASED:
    "payroll-table-column-visibility-released",
} as const;

/** How long an expanded sidebar stays open before resetting to collapsed (ms). */
export const SIDEBAR_EXPANDED_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Sidebar stays collapsed (narrow rail + tooltips) when the viewport width is
 * strictly below this value (px). Matches CSS `(max-width: SIDEBAR_EXPANDED_MIN_VIEWPORT_PX - 1px)`.
 */
export const SIDEBAR_EXPANDED_MIN_VIEWPORT_PX = 1000;
// Cookie configuration
export const COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    name: "access_token",
    secure: true,
    sameSite: "strict" as const,
  },
  REFRESH_TOKEN: {
    name: "refresh_token",
    secure: true,
    sameSite: "strict" as const,
  },
} as const;
