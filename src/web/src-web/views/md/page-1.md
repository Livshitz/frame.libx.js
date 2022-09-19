Showdown is a Javascript Markdown to HTML converter, based on the original works by John Gruber. It can be used client side (in the browser) or server side (with Node or io).

# Page-1 {{ text }} -- yo yo

<editable v-model='editableContent' />


# H1
## H2
### H3

**bold text**

*italicized text*

> blockquote

1. First item
2. Second item
3. Third item

- First item
- Second item
- Third item

`code`

[title](https://www.example.com)

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

-------------

```html
<ul>
	<li><p>foo</p></li>
	<li><p>bar</p></li>
	<li><p>baz</p></li>
</ul>
```

| A | B | C |   |   |
|---|---|---|---|---|
| 2 | 1 |   |   |   |
| 3 |   |   |   |   |
|   |   |   |   |   |

This new ruleset is based on the comments of Markdown's author John Gruber in the [Markdown discussion list][md-newsletter].

[md-spec]: http://daringfireball.net/projects/markdown/
[md-newsletter]: https://pairlist6.pair.net/mailman/listinfo/markdown-discuss
[atx]: http://www.aaronsw.com/2002/atx/intro
[setext]: https://en.wikipedia.org/wiki/Setext
[readme]: https://github.com/showdownjs/showdown/blob/master/README.md
[awkward effect]: http://i.imgur.com/YQ9iHTL.gif
[emoji list]: https://github.com/showdownjs/showdown/wiki/emojis
