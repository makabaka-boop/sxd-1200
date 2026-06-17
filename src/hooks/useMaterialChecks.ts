import { useMemo } from 'react';
import type { Material, CourseInfo, CheckResult, CheckType } from '@/types';

export function useMaterialChecks(materials: Material[], courseInfo: CourseInfo) {
  const checkResults = useMemo(() => {
    const results: CheckResult[] = [];

    const copiesIssues = materials.filter(
      (m) => m.status !== 'cancelled' && m.copies + m.spareCopies < courseInfo.expectedCount
    );
    if (copiesIssues.length > 0) {
      results.push({
        type: 'copies',
        severity: 'error',
        message: `有 ${copiesIssues.length} 项资料份数（含备用）低于预计人数 ${courseInfo.expectedCount} 人`,
        materialIds: copiesIssues.map((m) => m.id),
      });
    }

    const nameVersionMap = new Map<string, Set<string>>();
    materials.forEach((m) => {
      if (m.status === 'cancelled') return;
      if (!nameVersionMap.has(m.name)) {
        nameVersionMap.set(m.name, new Set());
      }
      nameVersionMap.get(m.name)!.add(m.version);
    });

    const versionMixNames: string[] = [];
    const versionMixIds: string[] = [];
    nameVersionMap.forEach((versions, name) => {
      if (versions.size > 1) {
        versionMixNames.push(name);
        materials
          .filter((m) => m.name === name && m.status !== 'cancelled')
          .forEach((m) => versionMixIds.push(m.id));
      }
    });

    if (versionMixNames.length > 0) {
      results.push({
        type: 'version',
        severity: 'warning',
        message: `以下资料存在版本混用：${versionMixNames.join('、')}`,
        materialIds: versionMixIds,
      });
    }

    const stageNameMap = new Map<string, Set<string>>();
    materials.forEach((m) => {
      if (m.status === 'cancelled') return;
      const key = m.stage;
      if (!stageNameMap.has(key)) {
        stageNameMap.set(key, new Set());
      }
      stageNameMap.get(key)!.add(m.name);
    });

    const duplicateIds: string[] = [];
    const duplicateInfos: string[] = [];
    materials.forEach((m) => {
      if (m.status === 'cancelled') return;
      const sameStageAndName = materials.filter(
        (other) =>
          other.id !== m.id &&
          other.stage === m.stage &&
          other.name === m.name &&
          other.status !== 'cancelled'
      );
      if (sameStageAndName.length > 0 && !duplicateIds.includes(m.id)) {
        duplicateIds.push(m.id, ...sameStageAndName.map((s) => s.id));
        const info = `${m.stage} - ${m.name}`;
        if (!duplicateInfos.includes(info)) {
          duplicateInfos.push(info);
        }
      }
    });

    if (duplicateInfos.length > 0) {
      results.push({
        type: 'duplicate',
        severity: 'warning',
        message: `同一环节存在重复资料：${duplicateInfos.join('；')}`,
        materialIds: [...new Set(duplicateIds)],
      });
    }

    const remarkIssues = materials.filter(
      (m) => (m.status === 'pending' || m.status === 'reprint') && !m.remark.trim()
    );
    if (remarkIssues.length > 0) {
      results.push({
        type: 'remark',
        severity: 'warning',
        message: `有 ${remarkIssues.length} 项待准备/需加印的资料缺少备注说明`,
        materialIds: remarkIssues.map((m) => m.id),
      });
    }

    return results;
  }, [materials, courseInfo.expectedCount]);

  const abnormalMaterialIds = useMemo(() => {
    const ids = new Set<string>();
    checkResults.forEach((r) => {
      r.materialIds.forEach((id) => ids.add(id));
    });
    return ids;
  }, [checkResults]);

  const abnormalIdsByType = useMemo(() => {
    const map = new Map<CheckType, Set<string>>();
    checkResults.forEach((r) => {
      if (!map.has(r.type)) {
        map.set(r.type, new Set());
      }
      r.materialIds.forEach((id) => map.get(r.type)!.add(id));
    });
    return map;
  }, [checkResults]);

  const getIdsByCheckType = (type: CheckType | ''): Set<string> => {
    if (!type) return abnormalMaterialIds;
    return abnormalIdsByType.get(type) || new Set();
  };

  return {
    checkResults,
    abnormalMaterialIds,
    abnormalIdsByType,
    getIdsByCheckType,
    hasErrors: checkResults.some((r) => r.severity === 'error'),
    hasWarnings: checkResults.some((r) => r.severity === 'warning'),
  };
}
