#!/bin/sh
# conventional.sh <subject>: refuses a subject that isn't a Conventional Commit, `type(scope)!: text`
# with one of the types below. git's own merge and revert subjects pass, and so do fixup!, squash!
# and amend! ones, which a rebase folds away. The commit-msg hook runs it on each local commit, and
# the workflow's `commits` job on a pull request's title and on the commit that lands on main.
set -eu

subject="${1-}"
types='feat|fix|perf|refactor|test|docs|build|ci|chore'
if printf '%s\n' "$subject" | grep -Eq "^($types)(\([^()[:space:]]+\))?!?: [^[:space:]]" ||
    printf '%s\n' "$subject" | grep -Eq '^(Merge |Revert "|fixup! |squash! |amend! )'; then
    exit 0
fi

cat >&2 <<MSG
the subject isn't a Conventional Commit:

    $subject

Write it as type(scope): a prose sentence, the scope optional and ! before the colon for a
breaking change, with type one of: $(printf '%s' "$types" | sed 's/|/, /g').
For example: feat: the front page links to the docs
MSG
exit 1
