import { useMemo } from 'react';
import type { Material, Filters, CheckType } from '@/types';

export function useFilteredMaterials(
  materials: Material[],
  filters: Filters,
  abnormalIds: Set<string>,
  getIdsByCheckType: (type: CheckType | '') => Set<string>
) {
  const filtered = useMemo(() => {
    let checkTypeIds: Set<string> | null = null;
    if (filters.checkType) {
      checkTypeIds = getIdsByCheckType(filters.checkType);
    }

    return materials.filter((m) => {
      if (filters.stage && m.stage !== filters.stage) return false;
      if (filters.status && m.status !== filters.status) return false;
      if (filters.version && m.version !== filters.version) return false;
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        if (
          !m.name.toLowerCase().includes(kw) &&
          !m.remark.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }
      if (filters.showAbnormal && !abnormalIds.has(m.id)) return false;
      if (checkTypeIds && !checkTypeIds.has(m.id)) return false;
      return true;
    });
  }, [materials, filters, abnormalIds, getIdsByCheckType]);

  return filtered;
}
