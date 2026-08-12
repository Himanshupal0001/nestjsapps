# Git Workflow — NotePad

Conventions for adding a feature to this repo (Turborepo monorepo, `dev` as the
integration branch, `main` release-only, CI runs on PRs into `dev`).

## 1. The loop for one feature

```bash
git checkout dev && git pull --ff-only origin dev   # always branch from fresh dev
git checkout -b feat/notes-autosave
# ...work, committing as you go...
git push -u origin feat/notes-autosave
gh pr create --base dev --fill
```

Branch from `dev`, never from another feature branch, unless you genuinely
depend on it — stacked branches turn into painful rebases here.

### Branch naming

Type + scope. In a monorepo, include the app so the branch list is readable at a
glance.

| Prefix      | Use for                        | Example                      |
| ----------- | ------------------------------ | ---------------------------- |
| `feat/`     | New functionality              | `feat/web-editor-toolbar`    |
| `fix/`      | Bug fixes                      | `fix/backend-auth-guard`     |
| `refactor/` | No behavior change             | `refactor/ui-button-variants`|
| `chore/`    | Deps, config, tooling          | `chore/bump-turbo`           |
| `docs/`     | Documentation only             | `docs/api-readme`            |

## 2. Commits

Small and atomic — one logical change each. The test: could you revert this
commit alone and have the repo still make sense?

Refactor and behavior change belong in **separate** commits, so a reviewer can
read the refactor without hunting for the real change inside it.

Use Conventional Commits with this repo's scopes (`web`, `backend`, `ui`,
`deps`):

```
feat(web): autosave notes on 2s idle
fix(backend): reject empty note titles
refactor(ui): extract Button variant map
chore(deps): bump turbo to 2.10.9
```

- Subject line imperative mood, under ~72 chars, no trailing period.
- Body explains **why**, not what — the diff already says what.
- Reference issues: `Closes #12`.
- After adding a dep, check `git diff pnpm-lock.yaml` reflects only that change.

## 3. Keeping up to date

While the PR is open, if `dev` moves:

```bash
git fetch origin
git rebase origin/dev          # your branch is unshared -> rebase is fine
git push --force-with-lease    # never plain --force
```

- Rebase your own feature branch to keep history linear.
- **Never rebase `dev` or `main`.**
- `--force-with-lease` refuses to clobber someone else's push; plain `--force`
  does not.
- If someone else has checked out your branch, use `git merge origin/dev`
  instead. Rewriting shared history is the one thing that actually costs the
  team time.

## 4. Before opening the PR

Run what CI runs, plus what it doesn't:

```bash
pnpm lint && pnpm check-types && pnpm build
```

### Known CI gaps

CI currently runs only `pnpm lint --filter=backend --filter=web`. Be aware:

- `check-types` and `build` are **not** in CI — a type error or broken build can
  merge green.
- `packages/ui` is **not** covered by the lint filter.
- `.github/workflows/ci.yml:25` uses `pnpm install -frozen-lockfile` with a
  single dash. It should be `--frozen-lockfile`; as written the lockfile is not
  enforced, so CI can resolve different versions than your machine.
- Nothing gates `dev` -> `main`. Add `main` to `on.pull_request.branches` so
  release PRs run the same checks.

## 5. Pull requests

- Keep them small. Under ~400 lines of real change reviews well; 2000 gets
  rubber-stamped. Ship big features as sequential PRs behind a flag rather than
  one megabranch.
- Write the description for someone with no context: **what** changed, **why**,
  **how to verify**.
- Self-review your own diff on GitHub before requesting review — you will catch
  the stray `console.log` and the commented-out block yourself.

### Merge strategy

| Direction      | Strategy       | Why                                              |
| -------------- | -------------- | ------------------------------------------------ |
| feature -> `dev` | **Squash merge** | Collapses WIP commits; `dev` stays a clean list of features |
| `dev` -> `main`  | **Merge commit** | Release keeps the individual feature commits     |

Delete the feature branch after merge.

## 6. Habits that save you

- `git commit --amend` and interactive rebase to clean up **before** pushing.
  After pushing to a shared branch, leave history alone.
- `git add -p` instead of `git add .` — you notice what you are actually
  committing.
- Never commit secrets. Verify `apps/backend/.env` is gitignored before the
  first commit; scrubbing a pushed secret means rotating it, not just rewriting
  history.
- `git stash` for a quick context switch. `git worktree add` if you need two
  branches at once without stashing at all.
- Protect `main` and `dev` in GitHub settings: require PR + passing CI, block
  force pushes. Discipline you do not have to remember is the only kind that
  holds.
