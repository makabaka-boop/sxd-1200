import type { TemplateMaterial, Material } from '@/types';

export interface CalculatedCopies {
  copies: number;
  spareCopies: number;
}

export function calculateCopiesForExpectedCount(
  templateMaterial: TemplateMaterial,
  templateExpectedCount: number,
  currentExpectedCount: number
): CalculatedCopies {
  if (templateExpectedCount <= 0 || currentExpectedCount <= 0) {
    return {
      copies: templateMaterial.copies,
      spareCopies: templateMaterial.spareCopies,
    };
  }

  if (templateExpectedCount === currentExpectedCount) {
    return {
      copies: templateMaterial.copies,
      spareCopies: templateMaterial.spareCopies,
    };
  }

  const ratio = currentExpectedCount / templateExpectedCount;

  const calculatedCopies = Math.max(
    0,
    Math.round(templateMaterial.copies * ratio)
  );

  const calculatedSpareCopies = Math.max(
    0,
    Math.round(templateMaterial.spareCopies * ratio)
  );

  return {
    copies: calculatedCopies,
    spareCopies: calculatedSpareCopies,
  };
}

export function recalculateMaterialCopies(
  material: Material,
  templateExpectedCount: number,
  currentExpectedCount: number
): CalculatedCopies {
  if (templateExpectedCount <= 0 || currentExpectedCount <= 0) {
    return {
      copies: material.copies,
      spareCopies: material.spareCopies,
    };
  }

  if (templateExpectedCount === currentExpectedCount) {
    return {
      copies: material.copies,
      spareCopies: material.spareCopies,
    };
  }

  const ratio = currentExpectedCount / templateExpectedCount;

  return {
    copies: Math.max(0, Math.round(material.copies * ratio)),
    spareCopies: Math.max(0, Math.round(material.spareCopies * ratio)),
  };
}

export function parseCopiesRule(rule: string): {
  copiesPerPerson: number;
  spareFixed: number;
  sparePercent: number;
} {
  const result = {
    copiesPerPerson: 1,
    spareFixed: 0,
    sparePercent: 0,
  };

  if (!rule) return result;

  const lowerRule = rule.toLowerCase();

  const spareFixedMatch = lowerRule.match(/(\d+)\s*份?\s*备用/);
  if (spareFixedMatch) {
    result.spareFixed = parseInt(spareFixedMatch[1], 10);
  }

  const sparePercentMatch = lowerRule.match(/(\d+(?:\.\d+)?)\s*%/);
  if (sparePercentMatch) {
    result.sparePercent = parseFloat(sparePercentMatch[1]);
  }

  const copiesMatch = lowerRule.match(/每人\s*(\d+)\s*份/);
  if (copiesMatch) {
    result.copiesPerPerson = parseInt(copiesMatch[1], 10);
  }

  return result;
}

export function calculateCopiesFromRule(
  expectedCount: number,
  rule: string
): CalculatedCopies {
  const parsed = parseCopiesRule(rule);
  const copies = Math.max(0, expectedCount * parsed.copiesPerPerson);
  const spareFromPercent = Math.round(copies * (parsed.sparePercent / 100));
  const spareCopies = Math.max(0, parsed.spareFixed + spareFromPercent);

  return {
    copies: Math.round(copies),
    spareCopies,
  };
}
