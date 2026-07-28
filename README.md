# Otavio Zanon — Interactive Terminal Resume

Toggle **EN** / **PT-BR** via the titlebar button. All output, commands, and the PDF export are translated.

<p align="center">
  <a href="https://otaviozanonresume.vercel.app/"><strong>Otavio Zanon Resume</strong></a>
</p>

## Commands

| EN               | PT            |                                         |
| ---------------- | ------------- | --------------------------------------- |
| `help`           | `help`        | available commands                      |
| `whoami` `about` | `sobre`       | professional summary                    |
| `experience`     | `experiencia` | work history                            |
| `education`      | `formacao`    | academic, languages & certs             |
| `skills`         | `habilidades` | tech stack by category                  |
| `projects` `ls`  | `projetos`    | projects by category                    |
| `contact`        | `contato`     | email, phone, links                     |
| `download`       | `baixar`      | generate A4 resume PDF                  |
| `open <key>`     | `open <key>`  | `portfolio` `linkedin` `github` `email` |
| `clear`          | `limpar`      | clear terminal                          |
| `banner`         | `banner`      | print ASCII art                         |

## Files

```
js/config.js      data & i18n
js/terminal.js    CLI engine, commands, lang toggle
js/resume.js      PDF resume builder
js/heatmap.js     contribution heatmap
js/main.js        bootstrap & chrome
css/style.css     terminal theme
```
