#!/usr/bin/env bash

set -euo pipefail

readonly CONTENT_DIRECTORY="${GITHUB_WORKSPACE}/app/src/content/wiki"
readonly WIKI_DIRECTORY="${RUNNER_TEMP}/mrkgron-wiki"
readonly WIKI_REMOTE="https://x-access-token:${WIKI_TOKEN}@github.com/${GITHUB_REPOSITORY}.wiki.git"

declare -A PAGE_TITLES=(
  [home]="Mrkgron Wiki"
  [getting-started]="Getting Started"
  [platform-overview]="Platform Overview"
  [dashboard]="Dashboard"
  [accounts]="Accounts"
  [transactions]="Transactions"
  [investments]="Investments"
  [compliance]="Compliance"
  [billing]="Billing"
  [settings]="Settings"
  [premium-filters]="Premium Filter System"
  [header-footer]="Header and Footer System"
  [branding]="Branding and Identity"
  [developer]="Developer Documentation"
  [release-notes]="Release Notes"
  [faq]="FAQ"
  [legal-compliance]="Legal and Compliance"
)

git clone "${WIKI_REMOTE}" "${WIKI_DIRECTORY}"
find "${WIKI_DIRECTORY}" -maxdepth 1 -name "*.md" -delete

for source_file in "${CONTENT_DIRECTORY}"/*.md; do
  slug="$(basename "${source_file}" .md)"
  title="${PAGE_TITLES[${slug}]}"
  target_file="${WIKI_DIRECTORY}/${slug}.md"

  if [[ "${slug}" == "home" ]]; then
    target_file="${WIKI_DIRECTORY}/Home.md"
  fi

  {
    printf '# %s\n\n' "${title}"
    sed 's#](/wiki/#](#g' "${source_file}"
  } > "${target_file}"
done

cat > "${WIKI_DIRECTORY}/_Sidebar.md" <<'EOF'
# Mrkgron Wiki

- [Home](Home)
- [Getting Started](getting-started)
- [Platform Overview](platform-overview)
  - [Dashboard](dashboard)
  - [Accounts](accounts)
  - [Transactions](transactions)
  - [Investments](investments)
  - [Compliance](compliance)
  - [Billing](billing)
  - [Settings](settings)
- [Premium Filter System](premium-filters)
- [Header and Footer System](header-footer)
- [Branding and Identity](branding)
- [Developer Documentation](developer)
- [Release Notes](release-notes)
- [FAQ](faq)
- [Legal and Compliance](legal-compliance)
EOF

if [[ -z "$(git -C "${WIKI_DIRECTORY}" status --porcelain)" ]]; then
  exit 0
fi

git -C "${WIKI_DIRECTORY}" config user.name "github-actions[bot]"
git -C "${WIKI_DIRECTORY}" config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git -C "${WIKI_DIRECTORY}" add --all
git -C "${WIKI_DIRECTORY}" commit -m "Publish Mrkgron wiki"
git -C "${WIKI_DIRECTORY}" push origin master