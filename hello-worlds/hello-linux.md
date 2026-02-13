---
layout: page
title: "Hello Linux From Scratch"
created: 2026/02/04
updated: 2026/02/04
version: 0.0.1
categories: article
tags: tech hidden
---

UTM VM with 10GB & 6 CPU cores

## Interesting Commands

popd
pushd
dirname
`` and $() work as bash cmd substitution
under_{,a,b} -> under_, under_a, under_b. Strict text substitution

understand this in relation to ln -s The "Relative Path" Rule                                                                           When you create a symlink with a relative path (one that doesn't start with /), that path
     is relative to the directory where the link itself lives, not the directory where you are          currently standing.
chown takes a --from option that filters user and group
mount --bind must be used so we can mirror outside of chroot
have to constantly copy some commandt forced me to learn how to caret F7 browse!

sticky bit
`install` combine mkdir, chown, chmod
So many tools that do cool things:
* byson
* ncurses
* the pattern replacer one
* texinfo used to generate multiple formats from one description
* findmnt
* lsblk
