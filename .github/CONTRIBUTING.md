<h2 align="center">Code Contributions</h2>

If you want to contribute, read this section carefully

<h3>Step 1: Fork</h3>

Fork the project [on GitHub][rep-github-url] and clone your fork
locally.

```text
$ git clone git@github.com:username/TobiasBot.git
$ cd TobiasBot
$ git remote add upstream https://github.com/tobias-inc/TobiasBot.git
```

<h4>Which branch?</h4>

For developing new features and bug fixes, the `dev/features` branch should be pulled
and built upon.

<h3>Step 2: Branch</h3>

Create a branch and start hacking:

```text
$ git checkout -b my-branch -t dev/features
```

<h3>Step 3: Commit</h3>

Make sure git knows your name and email address:

```text
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Add and commit:

```text
$ git add my/changed/files
$ git commit
```
