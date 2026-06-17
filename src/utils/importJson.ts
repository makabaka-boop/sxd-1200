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
  const data = JSON.parse(jsonString);

  if (!data || typeof data !== 'object') {
    throw new Error('文件格式无效：根节点必须是对象');
  }

  if (!data.courseInfo || typeof data.courseInfo !== 'object') {
    throw new Error('文件格式无效：缺少 courseInfo 字段');
  }

  if (!Array.isArray(data.materials)) {
    throw new Error('文件格式无效：缺少 materials 数组');
  }

  const courseInfo: CourseInfo = {
    name: data.courseInfo.name || '',
    date: data.courseInfo.date || new Date().toISOString().split('T')[0],
    classCode: data.courseInfo.classCode || '',
    expectedCount: data.courseInfo.expectedCount || 0,
  };

  const validStatuses: string[] = ['pending', 'ready', 'reprint', 'cancelled'];
  const materials: Material[] = data.materials.map((m: Record<string, unknown>, index: number) => {
    if (!m || typeof m !== 'object') {
      throw new Error(`文件格式无效：第 ${index + 1} 项资料格式错误`);
    }
    const rawStatus = typeof m.status === 'string' ? m.status : '';
    return {
      id: typeof m.id === 'string' ? m.id : generateId(),
      name: typeof m.name === 'string' ? m.name : '',
      version: typeof m.version === 'string' ? m.version : '',
      copies: typeof m.copies === 'number' ? m.copies : 0,
      spareCopies: typeof m.spareCopies === 'number' ? m.spareCopies : 0,
      stage: typeof m.stage === 'string' ? m.stage : '',
      status: validStatuses.includes(rawStatus)
        ? (rawStatus as MaterialStatus)
        : 'pending',
      remark: typeof m.remark === 'string' ? m.remark : '',
    };
  });

  return {
    courseInfo,
    materials,
    exportedAt: data.exportedAt || new Date().toISOString(),
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
