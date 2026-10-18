# The commands to work on the site. `just` lists them.

# A recipe's arguments reach its lines as "$@", quoted as they were typed.
set positional-arguments

# List the recipes
[private]
default:
    @just --list --unsorted

# Install the tools and the packages, and turn on the repo's commit-msg hook
setup:
    mise install
    bun install
    git config core.hooksPath .githooks

# Run the site's tests: the built server against a fake S3, the tester script and the page's components
test *args:
    NO_COLOR=1 bunx vitest run "$@"

# Serve the site with hot reload, "Get an invite" going to a placeholder unless INVITE_CONTACT is set
dev *args:
    INVITE_CONTACT="${INVITE_CONTACT:-invites@example.com}" bun --bun run dev "$@"

# Manage the testers in the bucket: add <name>, which prints their invite link, revoke <name>, or list. The bucket from the S3_* variables, e.g. doppler run -- just tester list
tester *args:
    bun scripts/tester.ts "$@"

# Lint the workflows and the shell scripts, as actionlint and shellcheck from mise.toml
lint:
    actionlint
    shellcheck scripts/conventional.sh .githooks/commit-msg
