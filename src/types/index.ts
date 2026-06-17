export interface CourseInfo {
  name: string;
  date: string;
  classCode: string;
  expectedCount: number;
}

export type MaterialStatus = 'pending' | 'ready' | 'reprint' | 'cancelled';

export interface Material {
  id: string;
  name: string;
  version: string;
  copies: number;
  spareCopies: number;
  stage: string;
  status: MaterialStatus;
  remark: string;
  templateId?: string;
}

export interface TemplateMaterial {
  name: string;
  version: string;
  copies: number;
  spareCopies: number;
  stage: string;
  remark: string;
}

export interface CourseTemplate {
  id: string;
  name: string;
  classType: string;
  defaultStages: string[];
  materials: TemplateMaterial[];
  copiesRule: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  stage: string;
  status: string;
  version: string;
  keyword: string;
  showAbnormal: boolean;
  checkType: CheckType | '';
}

export const CHECK_TYPE_LABELS: Record<CheckType, string> = {
  copies: '份数不足',
  version: '版本混用',
  duplicate: '资料重复',
  remark: '备注缺失',
};

export type CheckType = 'copies' | 'version' | 'duplicate' | 'remark';

export interface CheckResult {
  type: CheckType;
  severity: 'warning' | 'error';
  message: string;
  materialIds: string[];
}

export const STAGES = ['课前预习', '课堂讲义', '课堂练习', '课后作业', '测试评估', '其他'];

export const STATUS_LABELS: Record<MaterialStatus, string> = {
  pending: '待准备',
  ready: '已准备',
  reprint: '需加印',
  cancelled: '取消使用',
};

export const STATUS_COLORS: Record<MaterialStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  reprint: 'bg-rose-100 text-rose-800 border-rose-200',
  cancelled: 'bg-slate-200 text-slate-600 border-slate-300',
};

export interface ImportedData {
  courseInfo: CourseInfo;
  materials: Material[];
  templates?: CourseTemplate[];
  exportedAt: string;
}

export interface DuplicateCheckResult {
  duplicates: Material[];
  nonDuplicates: Material[];
  duplicateCount: number;
}

export interface ImportPreviewStats {
  materialCount: number;
  statusCounts: Record<MaterialStatus, number>;
  duplicateCount: number;
  willBeImportedCount: number;
}

export type ImportMode = 'overwrite' | 'append';
