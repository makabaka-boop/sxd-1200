import type {
  CourseInfo,
  Material,
  MaterialStatus,
  ImportedData,
  DuplicateCheckResult,
  ImportPreviewStats,
} from '@/types';
import { generateId } from './idGenerator';

export function parseImportedJson(jsonString: string): ImportedData {
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    throw new Error('文件内容不是合法的 JSON 格式');
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('文件格式无效：根节点必须是对象');
  }

  const root = data as Record<string, unknown>;

  if (!root.courseInfo || typeof root.courseInfo !== 'object' || Array.isArray(root.courseInfo)) {
    throw new Error('文件格式无效：缺少 courseInfo 字段');
  }

  if (!Array.isArray(root.materials)) {
    throw new Error('文件格式无效：缺少 materials 数组');
  }

  if (root.materials.length === 0) {
    throw new Error('文件格式无效：materials 数组为空，无资料可导入');
  }

  const ci = root.courseInfo as Record<string, unknown>;
  const courseInfo: CourseInfo = {
    name: typeof ci.name === 'string' && ci.name.trim() ? ci.name.trim() : '',
    date: typeof ci.date === 'string' && ci.date.trim() ? ci.date.trim() : '',
    classCode: typeof ci.classCode === 'string' && ci.classCode.trim() ? ci.classCode.trim() : '',
    expectedCount: typeof ci.expectedCount === 'number' && ci.expectedCount >= 0 ? ci.expectedCount : 0,
  };

  const validStatuses: string[] = ['pending', 'ready', 'reprint', 'cancelled'];
  const validMaterials: Material[] = [];
  const invalidItems: string[] = [];

  (root.materials as unknown[]).forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      invalidItems.push(`第 ${index + 1} 项不是对象`);
      return;
    }
    const m = item as Record<string, unknown>;

    const name = typeof m.name === 'string' ? m.name.trim() : '';
    const version = typeof m.version === 'string' ? m.version.trim() : '';
    const stage = typeof m.stage === 'string' ? m.stage.trim() : '';

    if (!name) {
      invalidItems.push(`第 ${index + 1} 项缺少资料名称`);
      return;
    }

    const rawStatus = typeof m.status === 'string' ? m.status : '';

    validMaterials.push({
      id: typeof m.id === 'string' && m.id.trim() ? m.id : generateId(),
      name,
      version,
      copies: typeof m.copies === 'number' && m.copies >= 0 ? m.copies : 0,
      spareCopies: typeof m.spareCopies === 'number' && m.spareCopies >= 0 ? m.spareCopies : 0,
      stage,
      status: validStatuses.includes(rawStatus) ? (rawStatus as MaterialStatus) : 'pending',
      remark: typeof m.remark === 'string' ? m.remark : '',
    });
  });

  if (validMaterials.length === 0) {
    throw new Error(
      `文件中无有效资料可导入${invalidItems.length > 0 ? `（${invalidItems.join('；')}）` : ''}`
    );
  }

  if (invalidItems.length > 0) {
    const skipped = (root.materials as unknown[]).length - validMaterials.length;
    throw new Error(
      `文件中存在 ${skipped} 项异常数据已跳过：${invalidItems.slice(0, 5).join('；')}${invalidItems.length > 5 ? '...' : ''}。请修正后重新导出，或确认仅导入有效数据。`
    );
  }

  return {
    courseInfo,
    materials: validMaterials,
    exportedAt: typeof root.exportedAt === 'string' && root.exportedAt.trim() ? root.exportedAt : new Date().toISOString(),
  };
}

export function getMaterialKey(material: {
  name: string;
  version: string;
  stage: string;
}): string {
  return `${material.name.trim().toLowerCase()}-${material.version.trim().toLowerCase()}-${material.stage.trim().toLowerCase()}`;
}

export function checkDuplicates(
  importedMaterials: Material[],
  existingMaterials: Material[]
): DuplicateCheckResult {
  const existingKeys = new Set(existingMaterials.map(getMaterialKey));

  const duplicates: Material[] = [];
  const nonDuplicates: Material[] = [];

  importedMaterials.forEach((material) => {
    const key = getMaterialKey(material);
    if (existingKeys.has(key)) {
      duplicates.push(material);
    } else {
      nonDuplicates.push(material);
      existingKeys.add(key);
    }
  });

  return {
    duplicates,
    nonDuplicates,
    duplicateCount: duplicates.length,
  };
}

export function countByStatus(materials: Material[]): Record<MaterialStatus, number> {
  const counts: Record<MaterialStatus, number> = {
    pending: 0,
    ready: 0,
    reprint: 0,
    cancelled: 0,
  };

  materials.forEach((m) => {
    counts[m.status] = (counts[m.status] || 0) + 1;
  });

  return counts;
}

export function calculateImportStats(
  importedMaterials: Material[],
  existingMaterials: Material[],
  isAppend: boolean
): ImportPreviewStats {
  const statusCounts = countByStatus(importedMaterials);
  let duplicateCount = 0;
  let willBeImportedCount = importedMaterials.length;

  if (isAppend && existingMaterials.length > 0) {
    const result = checkDuplicates(importedMaterials, existingMaterials);
    duplicateCount = result.duplicateCount;
    willBeImportedCount = result.nonDuplicates.length;
  }

  return {
    materialCount: importedMaterials.length,
    statusCounts,
    duplicateCount,
    willBeImportedCount,
  };
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
