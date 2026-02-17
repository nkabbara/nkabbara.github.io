---
layout: page
title: "Hello LFS"
created: 2026/02/17
updated: 2026/02/17
version: 0.0.1
categories: article
tags: tech hidden
---

When I learned about the [linux from scratch project](https://www.linuxfromscratch.org/) I could not hold myself back, I just had to build it. The amount of stuff I could learn completely overpowered any sense of responsibility tha I had for my time.

The first problem was figuring how to spawn a new system within a host without any cross contamination between the two. To do this we need to use a technique called cross-compilation, where we build a compiler on our host that produces code for our new linux distribution. My starting point is the compiler of the host system. My goal is to produce a fully functional compiler for my host distribution which then can be used to compile the rest of its software. You'd think this would be a matter of compiler flag wrangling, but it's a bit more complex if you want to ensure complete containment between the host and the new distribution. libgcc, a library within gcc requires that we have glibc available. But in order to build a glibc for our upcoming distribution, we need gcc. In order to resolve this circular dependency, we need to build gcc in stages. First, build a version that is just capable of building glibc. It's lacking tons of features that would otherwise be required, but it gets us closer to accomplishing that goal.
