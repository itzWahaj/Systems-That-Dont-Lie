# How to Push Your Project to GitHub

According to your request, here are the steps to push your code to the new repository: `https://github.com/itzWahaj/Systems-That-Dont-Lie.git`

## Step 1: Open your Terminal
Make sure you are in the project root directory: `d:\Work\Projects\Wahaj - Systems That Don't Lie (Portfolio)`

## Step 2: Configure the Remote
Run these commands in order.

```powershell
# 1. Remove any existing remote (just in case)
git remote remove origin

# 2. Add the correct remote URL
git remote add origin https://github.com/itzWahaj/Systems-That-Dont-Lie.git
```

## Step 3: Push the Code
Now push your committed changes to the main branch.

```powershell
git push -u origin main
```

## Verification
If successful, you should see output indicating the data was compressed and written to the remote repository.
