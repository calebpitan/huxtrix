---
name: create-pr
description: >-
  Open a GitHub pull request for the huxtrix repo. Use when the user asks to
  open a PR, create a pull request, push a branch for review, or document the
  changes in a pull request.
---

# Create a pull request

Open the PR against `main` with `gh`. Reply with the PR URL.

Remote: `origin` (`git@github.com:calebpitan/huxtrix.git`). Package manager: Yarn 4. Node: `>=22.14.0` (`.nvmrc`).

## Prepare

Run in parallel:

- `git status`
- `git diff` and `git diff --cached`
- `git log -15 --oneline`
- `git branch -vv`

If the branch already has commits, also run `git log main..HEAD --oneline` and `git diff main...HEAD`.

Opening a PR includes committing the requested work when it is still uncommitted. Leave unrelated local edits unstaged.

Never update git config. Never skip hooks. Never force-push `main`. Do not use `git rebase -i` or `git add -i`.

## Branch

If `HEAD` is `main`, create a branch before the commit:

```text
type/short-topic
```

Examples already in the repo: `feat/popular-mobile-tiles`, `fix/hydrate-auth-session`.

If `HEAD` is already a feature branch, stay on it.

## Commit

Subject line, matching `git log`:

```text
type(scope): imperative summary
```

Types in use: `feat`, `fix`, `refactor`. The subject says why. Body is one sentence when the subject is not enough.

```bash
git add <paths>
git commit -m "$(cat <<'EOF'
feat(logger): record request failures with structured logs

Replace console.error so production failures keep their cause.

EOF
)"
git status
```

Do not commit `dist/`, `.next/`, `.turbo/`, `*.tsbuildinfo`, or `.env*` other than `.env.example`. Do commit `yarn.lock` when dependencies change, and `.nvmrc` when `engines.node` changes.

If the hook rejects the commit, fix the problem and make a new commit. Do not amend a rejected commit.

## Push and open

```bash
git push -u origin HEAD
gh pr create --title "type(scope): summary" --body "$(cat <<'EOF'
<body>
EOF
)"
```

The title uses the same subject style as the commit. Base branch is `main`.

## Pull request body

Write what a reviewer has to verify. Do not list files.

```markdown
## Summary
- One to three bullets. Each bullet is a behavior change.

## Behavior
Include this when the change has operational consequences, or when the user asks to document the work.
- What the user or operator observes
- Decisions that are easy to miss (levels, redaction, what stays off the client)
- Limits

## Test plan
- [ ] A concrete check, including the edge this change fixes
```

Recent PRs use a short Summary plus a checkbox test plan. Read `gh pr view <n> --json title,body` when the tone is unclear.

Do not append a "Made with Cursor" line.

After `gh pr create` succeeds, send the user the URL.
