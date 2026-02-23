---
layout: page
title: "Hello LFS"
created: 2026/02/17
updated: 2026/02/23
version: 0.0.1
categories: article
tags: tech hidden
---

When I learned about the [linux from scratch project](https://www.linuxfromscratch.org/) I could not hold myself back, I just had to build it. The amount of stuff I could learn completely overpowered any sense of responsibility that I had for my time.

Before even starting, I knew that I needed a kernel for my new system to manage the hardware (and ?). I knew that I needed some basic tools like `ls`, `awk`, and `find`. I knew that I needed a bootloader to manage the booting and a way to initialize the system to get me to a login prompt. Before I overwhelmed myself with how all this was going to come together, I got the book and plunged right in.

My prelimenary list was correct, but what I didn't think about was that I needed a host system on which I could build my linux from scrath (a.k.a Nashix) and that I needed a compiler that has zero dependency with the said host. The first problem was easy to solve, I installed UTM on my mac and ran an Ubuntu VM on it be the host. Following the LFS book's instructions, I needed to use a technique called cross-compilation, where I built a compiler on the that produces code for our new linux distribution. My starting point is the compiler of the host system. My goal is to produce a fully functional compiler for my host distribution which then can be used to compile the rest of its software. You'd think this would be a matter of compiler flag wrangling, but it's a bit more complex if you want to ensure complete containment between the host and the new distribution. libgcc, a library within gcc requires that I have glibc available. But in order to build a glibc for our upcoming distribution, I need gcc. In order to resolve this circular dependency, I need to build gcc in stages. First, build a version that is just capable of building glibc. It's lacking tons of features that would otherwise be required, but it gets us closer to accomplishing that goal.
