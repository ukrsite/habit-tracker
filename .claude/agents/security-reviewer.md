# Security Reviewer Agent

**Purpose**: Deep-dive security review of auth/session/data-isolation diffs

**Scope**: Files in `backend/src/routes/`, `backend/src/middleware/`, `backend/src/ws/`

**Task description**:
Review the staged diff (or a specific commit/branch) for authorization and security violations:

1. **Missing 401/403 checks**: Flag route handlers that access user data without verifying session or ownership
2. **Session fixation**: Check for race conditions in session setup (Passport + `@fastify/session`)
3. **Ownership guards**: Verify all habit/checkin operations check `habit.userId === req.session.userId`
4. **WebSocket auth**: Confirm WS upgrade rejects unauthenticated connections
5. **SQL injection**: Scan for raw Drizzle queries without parameterization
6. **Input validation**: Check that dates, IDs, and status values are validated before use

**Success criteria**:
- No routes return user data without 401/403 guards
- All ownership checks follow the CLAUDE.md pattern
- WebSocket upgrade requires valid session cookie
- No hardcoded secrets or credentials in code

**Report format**:
```
Finding: [title]
Severity: Critical | Medium | Low
File: [path:line]
Issue: [description]
Fix: [suggestion]
```

**See also**: 
- `CLAUDE.md` Authorization Rules
- `docs/SECURITY.md` (npm audit analysis)
- `backend/src/middleware/requireAuth.ts` (reference implementation)
