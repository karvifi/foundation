# ULTRA CONSTITUTION

This document overrides defaults when there is any ambiguity.

## Core Principle
The foundation is not an app template. It is a universal execution framework.
The stack is selected by project context, not by assumption.

## Non-Negotiable Rules

1. Never assume language, framework, database, or cloud provider before project-profile intake is complete.
2. If user did not specify stack, run full intake and then provide one recommended stack with alternatives and tradeoffs.
3. No implementation starts before:
   - objective and constraints are explicit,
   - success criteria are measurable,
   - risk and security gates are defined,
   - testing strategy is selected,
   - rollback/recovery path is documented.
4. Every project flow must support:
   - new projects,
   - incomplete projects,
   - inherited projects with unknown state.
5. Output quality is judged by correctness, repeatability, and maintainability, not style hype.

## Mandatory Pre-Start Gates

`GATE 1` Problem Definition Complete
`GATE 2` Full Context Intake Complete
`GATE 3` Stack Decision Signed Off
`GATE 4` Security Baseline Signed Off
`GATE 5` Test/Eval Plan Signed Off
`GATE 6` Execution Plan (2-5 min tasks) Signed Off

If any gate is incomplete, implementation must not begin.

## Project-Profile Intake Dimensions

- Domain and user persona
- Delivery target (web, mobile, API, CLI, data pipeline, agentic system)
- Functional requirements
- Non-functional requirements (latency, scale, uptime, compliance)
- Existing code/assets and constraints
- Preferred and forbidden technologies
- Budget and operating model
- Team skill level
- Deployment environment
- Timeline and milestones

## Anti-Fragmentation Contract

All external repos must be processed through:
1. extraction (core idea + reusable parts + ignore list),
2. normalization (standard skill/agent/rule format),
3. integration mapping (control/skill/context/execution layer),
4. conflict resolution (duplicates and contradictions),
5. gap closure (missing capabilities filled by design, not random copy).

## Completion Standard

A foundation upgrade is complete only when:
- all selected repos are cataloged,
- all adopted patterns are normalized,
- all rejected patterns are tracked with reason,
- all critical gaps have concrete files and enforcement rules.
