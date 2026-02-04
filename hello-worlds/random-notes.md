---
layout: page
title: "Random Notes"
created: 2022-07-11
updated: 2026/02/03
version: 0.5.0
categories: tech
---

# Screen

Detach from a session: ctrl-a, ctrl-d

# Docker

Detach from a container ctrl-p, ctrl-q

# Misc

Loop on cli (bash):

```
for i in `seq 10`; do echo "myserver_$i"; done
```

List tcp listeners with their pids on Mac (nestat -nato equiv on linux):

```
sudo lsof -iTCP -sTCP:LISTEN -n -P
```

Bring background process to foreground

```
fg
```

Copy/Paste in cli

```
> pwd | pbcopy

> pbpaste
```
