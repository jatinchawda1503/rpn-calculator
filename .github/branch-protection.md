# Branch Protection Setup

To enforce that tests must pass before merging code, you should set up branch protection rules in your GitHub repository. Follow these steps:

## Setting up Branch Protection for the `main` Branch

1. Go to your repository on GitHub
2. Click on "Settings"
3. Select "Branches" from the left sidebar
4. Click "Add rule" under "Branch protection rules"
5. Under "Branch name pattern", enter `main`
6. Enable the following options:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
7. In the "Status checks that are required" section, search for and select:
   - `test` (this is the test job from your GitHub Actions workflow)
   - `Approve Merge` (this is the approval step from your GitHub Actions workflow)
8. Optional (recommended) settings:
   - ✅ Require linear history
   - ✅ Include administrators
9. Click "Create" or "Save changes"

## Additional Recommendations

- Consider enabling "Require approvals" with at least 1 approval required
- You may want to enable "Restrict who can push to matching branches" to protect the main branch from direct pushes

## How It Works

With these settings in place:

1. All changes must be made through pull requests
2. The GitHub Actions workflow will automatically run tests on pull requests
3. Pull requests cannot be merged until all tests pass
4. Failed tests will block merging until issues are fixed

This enforces the "tests must pass before merging" requirement you specified.

## Status Check Troubleshooting

If you don't see the status checks in the dropdown:

1. Make sure you've pushed the GitHub Actions workflow file to your repository
2. Create a test pull request to trigger the workflow at least once
3. After the workflow runs, the status checks should appear in the dropdown menu

You can update the branch protection rule at any time if needed. 