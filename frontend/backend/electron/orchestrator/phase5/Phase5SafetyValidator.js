"use strict";

class Phase5SafetyValidator {
  static validatePlanSafety(plan) {
    if (!plan) {
      return { status: "passed", verified: true, errors: [] };
    }

    const preserve = new Set(plan.preserve || []);
    const modify = new Set(plan.modify || []);
    const create = new Set(plan.create || []);
    const remove = new Set(plan.delete || []);

    const violations = [];

    for (const file of modify) {
      if (preserve.has(file)) {
        violations.push({ code: "PRESERVE_MODIFY_CONFLICT", path: file });
      }
    }

    for (const file of remove) {
      if (preserve.has(file)) {
        violations.push({ code: "PRESERVE_DELETE_CONFLICT", path: file });
      }
    }

    for (const file of create) {
      if (preserve.has(file)) {
        violations.push({ code: "PRESERVE_CREATE_CONFLICT", path: file });
      }
    }

    // Check for collisions across all groups (a file shouldn't be in both create and modify, etc.)
    const collisions = Phase5SafetyValidator.detectPlanCollisions(plan);
    for (const collision of collisions) {
       // Since the loop above checks preserve intersections, we avoid double counting, but let's record all others.
       violations.push({ code: "PLAN_COLLISION", path: collision.path, details: collision });
    }

    if (violations.length > 0) {
      return {
        status: "failed",
        verified: false,
        errors: violations
      };
    }

    return {
      status: "passed",
      verified: true,
      errors: []
    };
  }

  static detectPlanCollisions(plan) {
    const groups = [
      ["preserve", plan.preserve || []],
      ["modify", plan.modify || []],
      ["create", plan.create || []],
      ["delete", plan.delete || []]
    ];

    const owners = new Map();
    const conflicts = [];

    for (const [group, paths] of groups) {
      for (const file of paths) {
        if (owners.has(file)) {
          conflicts.push({
            path: file,
            first: owners.get(file),
            second: group
          });
        } else {
          owners.set(file, group);
        }
      }
    }

    return conflicts;
  }
}

module.exports = Phase5SafetyValidator;
