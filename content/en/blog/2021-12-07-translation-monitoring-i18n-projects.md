---
title: "Translation Monitoring for I18n Projects"
slug: "trans-monitor-i18n-proj"
date: 2021-12-07T19:25:35+08:00
draft: false
image: img/blog/translations.jpeg
authors: [Tianshu Li]
tags: ['i18n']
description: "I18n projects are hard to manage when apps and docs both get updated continuously. In this post we introduce a new tool to ease the pains of monitoring and make it easier to stay in sync with international audiences."
profile: img/team/tianshu-li.png
---

Developing applications for global users usually requires an internationalization (i18n) process that translates contents or user messages into different languages. Given how manual these process tend to be, the more we can automate the better -- for our sanity, for our wallets, and for our users. That's where Rumi comes in! <!--more-->

An i18n workflow can be seamlessly integrated with the application development workflow, so that source contents or messages can be easily extracted from the rest of the code base, sent to the translator or machine translated, and then compiled back into the code base for rendering the translated application. If this extract-translate-compile workflow is well integrated with other development workflows, it is much easier to get the translations updated or re-translated each time the source contents or messages get modified during development.

At Rotational, through our journey of developing globally distributed systems and translating our contents to accommodate global users, we encountered the need for continuous monitoring of our translation status, so that we can always know what contents still need to be translated, and if our translations are still up-to-date. For that goal, we developed [Rumi](https://github.com/rotationalio/rumi), an open-source Python package that can be integrated with your Github workflow, for translation status monitoring.

Rumi is inspired by tools such as [react-intl](https://formatjs.io/docs/react-intl/) and [Lingui.js](https://lingui.js.org/index.html) aiming to automate the extract and compile part for [React app](https://reactjs.org/). There are also translation platforms such as [translation.io](https://translation.io/lingui) and [localize](https://localizejs.com/features/translator-tools) that help bring translators together with developers to better collaborate on i18n projects.

Rumi looks at changes and timestamps from the git commit history, and compares timestamps of the source contents and translations to identify (re)translation needs. It can also be integrated with your i18n project as a Github action to inform you of these needs on every push or pull request.

Rumi currently supports two different workflows, for monitoring source contents in terms of either **files** or **messages**. The difference here is that files are longer pieces of content (e.g. `user-guide.md`) that may be partially updated, while the messages are sentences or phrases (e.g. user messages) that are always generated or revised in full. In this post, we will look at example usage for both file-based and messaged-based Rumi and see in more detail their monitoring outputs.

## File-based translation monitoring

For the example usage of file-based translation monitoring, let's look at the i18n workflow for a Hugo static site project. Usually, the workflow can be simplified into the following steps, where steps 2-4 come in iterations while the source content is being continuously developed:

1. Setup Hugo in [multilingual mode](https://gohugo.io/content-management/multilingual/)
2. Upload Source File
3. Send to Translator
4. Upload Translated File.

Rumi integrates (usually via Github Actions) at steps 2 and 4, performing the following steps to read and report translation status:

![Hugo Flow](/img/blog/hugo_flow.png)
**<div align="center">File-based translation flow exemplified with Hugo site</div>**

_Note: For more about setting up a Hugo site, check out the documentation about [Hugo in multilingual mode](https://gohugo.io/content-management/multilingual/).)_

#### 1. Create a FileReader object

First, create the `FileReader`:

```python
reader = FileReader(
        repo_path=".",
        branch="main",
        langs="",
        content_paths=["content"],
        extensions=[".md"],
        pattern="folder/",
        src_lang="en",
        use_cache=True
    )
```

Parameters:

- `repo_path`: Path to the repository for translation monitoring.
- `branch`: Name of the branch to read the github history from.
- `content_paths`: List of paths from the root of the repository to the directory that contains contents for translation, e.g., ["content", "data", "i18n"].
- `extensions`: List of extensions of the target files for translation monitoring.
- `pattern`: Two types of patterns in which the static site repository is organized: "folder (organizing contents from each locale into one folder of the locale name, e.g. `en/filename.md`, `fr/filename.md)` and ".lang" (organizing contents from each locale by tagging the file name with the locale name, e.g. `filename.en.md`, `filename.fr.md)`
- `langs`: Language codes joint by a white space as specified by the user. If not specified, FileReader will try to get languages from the filenames in the current repository for monitoring.
- `src_lang`: Default source language set by user.
- `use_cache`: Whether to use cached commit history data structure.

#### 2. Set targets for translation

If there are target files that cannot be captured by `content_paths` and `extensions`, you can also specify them by adding or deleting single filename.

```python
reader.add_target(filename)
reader.del_target(filename)
```

#### 3. Calculate commits

```python
commits = reader.parse_history()       # commits: structured commit history
```

### 4. Create reporter

```python
reporter = FileReporter(
    repo_path=reader.repo_path,
    src_lang=detail_src_lang,
    tgt_lang=detail_tgt_lang
)
```

`src_lang`: Language code of the source language (the original language of contents) to be reported. If not specified, all source language will be reported.
`tgt_lang`: Language code of the target language (language to translate contents
into) to be reported. If not specified, all target language will be reported.

#### 5. Report stats and details

Rumi can display translation status in two modes, stats mode and details mode:

Stats mode displays the number of Open (hasn't been translated), Updated (source file has been updated after translation), Completed (source file has been translated for all target languages). E.g.:

```python
stats = reporter.get_stats(commits)
reporter.print_stats(stats)

"""
    | Target Language   |   Total |   Open |   Updated |   Completed |
    |-------------------+---------+--------+-----------+-------------|
    | fr                |       0 |      0 |         0 |           0 |
    | en                |       1 |      0 |         0 |           1 |
    | ja                |       1 |      1 |         0 |           0 |
"""
```

Details mode displays translation work required for each target file together with more details. E.g.:

```python
details = reporter.get_details(commits)
reporter.print_details(details)

"""
| File    | Status    | Source Language | Word Count | Target Language | Percent Completed | Percent Updated |
|---------+-----------+-----------------+------------+-----------------+-------------------+-----------------|
| file.md | completed | fr              |          4 | en              | 100.0%            | 0%              |
| file.md | updated   | fr              |          4 | zh              | 50.0%             | 50.0%           |
| file.md | open      | fr              |          4 | ja              | 0%                | 100.0%          |
"""
```

Here `Word Count` reports number of words in the source file. `Percent Completed` is estimated by number of lines in the translation file divided by that in the source file. `Percent Updated` is number of lines inserted in the source file since the latest edit of the translation file.

## Message-based translation monitoring

Rumi also supports message-based translation monitoring for React apps that are set up with `Lingui.js`. The figure below illustrates the i18n workflow in such setting. This setting requires minimal changes in common UI dev (just wrap user messages as instructed). Once setup, the `extract` command can easily isolate these language-dependent messages from the rest of the code base into one separate file for each language, and the `compile` command will integrate translations back. Here are some additional resources for getting set up with Lingui on your React project:

- UI Dev: Setup Lingui.js
  - Installation: [Setup Lingui with React project](https://lingui.js.org/tutorials/setup-react.html)
  - Wrap Messages: Wrap UI text message according to [Lingui patterns](https://lingui.js.org/tutorials/react-patterns.html)
- Lingui Extract: `npm run extract` or `yarn extract`
- Lingui Compile: `npm run compile` or `yarn compile`

![](/img/blog/react_flow.png)
**<div align="center">Message-based translation flow exemplified with React App</div>**

At `Lingui Extract` and `Lingui Compile`, Rumi will perform similar steps for monitoring the translation status:

#### 1. Create the MsgReader object

First, create the `MsgReader`:

```python
reader = MsgReader(
    repo_path=".",
    branch="main",
    content_paths=["locales"],
    extensions=[".po"],
    src_lang="en",
    use_cache=True
    )
```

#### 2. Set the targets for translation

```python
reader.add_target(filename)
reader.del_target(filename)
```

#### 3. Calculate commits

```python
commits = reader.parse_history()
```

#### 4. Create reporter

```python
reporter = MsgReporter()

```

#### 5. Report stats and details

Messaged-based Rumi also supports reporting translation status in stats mode and details mode.

Stats mode prints out a summary of the translation status.

```python
stats = reporter.get_stats(commits, src_lang)
reporter.print_stats(stats)

"""
    | Language   |   Total |   Open |   Updated |   Completed |
    |------------+---------+--------+-----------+-------------|
    | en         |       2 |      0 |         0 |           0 |
    | fr         |       2 |      1 |         1 |           0 |
    | ja         |       2 |      0 |         1 |           1 |
"""
```

Detail mode prints out the details of messages needing translations for each language and provides word count, which can be helpful for determining thresholds for when to have content re-translated.

```python
details = reporter.get_details(commits, src_lang)
reporter.print_details(details)

"""
    ----------------------------------------------------------------------
    ja Open: 2
    msgid1
    msgid2
    ----------------------------------------------------------------------
    zh Open: 0
    ----------------------------------------------------------------------
    de Open: 0
    ----------------------------------------------------------------------
    fr Open: 1
    msgid1
    ----------------------------------------------------------------------
    en Open: 0
    ----------------------------------------------------------------------
"""
```

#### Diff the extracted file

Note that Lingui.js organize all messages and their translations by languages. Messages and translations in each language are stored in a single file. To get the newly inserted messages,

```python
reporter.download_needs(details, lang, path=".")
```

To integrate new translations back into the existing ones,

```python
reporter.insert_translations("new_translations.txt", "old_messages.po")

```

## Github Action

To setup your repository with a Rumi Github action so that stats and details are automated on push, include the following code in `.github/workflow/rumi.yaml`:

```yaml
name: Rumi translation monitoring
on: push

jobs:
  rumi:
    runs-on: ubuntu-latest
    steps:
      - name: Clone target repository
        run: |
          git clone [url of the target repository]

      - name: Run Action
        uses: tl6kk/rumi_action@main # to be changed after rumi publication
        with:
          which_rumi: "file" # "file" for file-based or "msg" for message-based
          repo_path: "path_to_repo"
          branch: "main"
          content_paths: "content1, content2, content3"
          extensions: ".md, .txt"
          target_files: "target1, target2, target3"
          pattern: "folder/" # "folder/" or ".lang" depending on the setup of file-based project
          langs: "en fr zh ja" # You can specify the languages to monitor with language codes
          src_lang: "en"
          detail_src_lang: ""
          detail_tgt_lang: ""
          stats_mode: "True"
          details_mode: "True"
          use_cache: "True"
```

## Conclusion

Although managing the dynamic, iterative i18n workflow is challenging, we believe that automation tools like Rumi can help simplify the steps, so that you can focus more on the development of applications and contents. In the future, we hope to extend Rumi to support the monitoring of other project platforms so that all applications can engage the global users they deserve.
