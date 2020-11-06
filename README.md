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
        uses: richardsimko/update-tag@v1
        with:
          tag_name: name-of-tag
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

- **tag_name** _(required)_ - The name of the tag you want to create or update.
