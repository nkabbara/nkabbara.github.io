---
layout: page
title: "Books"
created: 2025-01-28
updated: 2025-06-25
version: 1.0.1
categories: article
tags:
---

_My notes on non-fiction that I've read after Dec, 2024. In each book's page, I summarize how I'm currently applying it in my routines. Inspired by [Derek Sivers](https://sive.rs/book)_.

---

{%- for page in site.pages -%} {% unless page.categories contains 'book' %} {%
continue %} {% endunless %}

  {% capture image_path %}assets/book-{{page.title | replace: ' ', '-' | downcase }}{% endcapture %}
  {% assign image_src = 'assets/default-book-cover.png' %}
  {% for static_file in site.static_files %}
    {% if static_file.path contains image_path | append: '.png' %}
      {% assign image_src = image_path | append: '.png' %}
      {% break %}
    {% elsif static_file.path contains image_path | append: '.jpg' %}
      {% assign image_src = image_path | append: '.jpg' %}
      {% break %}
    {% endif %}
  {% endfor %}

  <article class="book">
      <a href="/{{page.path | replace: '.md', '' }}" class="book-title">
          <img
              src="/{{ image_src }}"
              alt="Cover of {{page.title}}"
              class="book-image"
          />
      </a>
      <a href="/{{page.path | replace: '.md', '' }}" class="book-title">
          <h2 class="book-title">{{page.title}}</h2>
      </a>
      <div class="book-author">by {{page.author}}</div>
      <p class="book-description">
          {{page.content | strip_html | truncatewords: 50}}
          <a href="/{{page.path | replace: '.md', '' }}" class="">read more.</a>
      </p>
  </article>
{%- endfor -%}
