---
layout: page
title: "Hello Nashix"
created: 2026/02/17
updated: 2026/02/23
version: 0.4.1
categories: article
tags: tech hidden
---

When I learned about the [Linux From Scratch project](https://www.linuxfromscratch.org/) I could not hold myself back, I just had to build it. The amount of stuff I could learn completely overpowered any sense of responsibility that I had for my time.

![Nashix](/assets/nashix.png)

Before reading the book I knew that I needed a kernel for my new OS, some basic tools like `ls`, `awk`, and `find`. A boot loader to manage the booting and a way to initialize the system to get me to a login prompt. But I didn't know how all these things came to be and how they fit together. At which point did the distribution creators stop collaging packages and started creating their own?

What I didn't realize was that I needed a host on which I could build my Linux from scratch (a.k.a Nashix) and that I needed a compiler that has zero dependency with said host to build the kernel and all the packages required to run an OS. The first problem was easy to solve, I installed UTM on my mac and ran an Ubuntu VM on it. The second problem was more involved. In order to get to the end result of building a native Nashix compiler, I had to go through two stages. In the first stage, I broke a circular dependency with gcc by building a gcc version stripped of features, but good enough to build glibc and libstdc++ which are required for a fully functional gcc (by libgcc). In stage two, I built a proper cross compiler that enabled me to compile a bunch of tools which were necessary to create independence from the host. So that I could chroot into an isolated directory to build the Nashix native gcc compiler amongst many other required packages and tools. A more articulated version of this process is in [the tech notes chapter](https://www.linuxfromscratch.org/lfs/view/stable/partintro/toolchaintechnotes.html). Once in the chrooted dir, I was basically doing the work of a package manager installing around 100 packages. Though boring at first, I ended up learning a ton about some cool tools like `ncurses`, `m4`, and `attr` that might come in handy when building other projects in the future.

![Compiler Stages](/assets/compiler-stages.svg)

The rest of the process isn't much different than setting up proper Linux distribution. My first Linux system was [Gentoo](https://www.gentoo.org/) in which I had to figure out how to configure boot scripts, modify the boot process, manage fstab and compile and setup Grub. I remembered the thousands of links that I had to deal with in `/dev` and my attempt to migrate to a better system that did not pan out and eventually made me move to Mac. The difference though with LFS is that you get to clearly see how all these different technologies fit together to make your own Linux. You get to learn about a bunch of amazing libraries that are available for free, created by awesome people and organizations that you can use to build on top of. I got stuck a few times in the process and without the help of the LFS discord, I would probably be still debugging.

If I see a need to create my own distro in the future, I would take the [jhalfs](https://github.com/automate-lfs/jhalfs) approach and customize from there.
