# GitHub Update Tag Action
A GitHub action that simply tags the repository with the specified tag. If the tag exists it gets updated.

## Usage
```yml
name: Deploy

on: [deployment]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Tag Repo
        uses: meyerkev/update-tag@v1
        with:
          tag_name: name-of-tag
          tag_ref: sha, branch, or other tag to tag against
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

- **tag_name** _(required)_ - The name of the tag you want to create or update.
- **tag_ref** _(optional)_ - The reference you want to set the tag to.

## Forking the repo
Fork away, but I could never get one of the CI tests to pass without using a PAT stuck in `secrets.CI_GITHUB_TOKEN`

