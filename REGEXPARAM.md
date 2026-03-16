# regexparam

> Vendored from [lukeed/regexparam](https://github.com/lukeed/regexparam). A tiny utility that converts route patterns into RegExp.

With `regexparam`, you may turn a pathing string (eg, `/users/:id`) into a regular expression.

An object with shape of `{ keys, pattern }` is returned, where `pattern` is the `RegExp` and `keys` is an array of your parameter name(s) in the order that they appeared.

`regexparam` handles the following pathing operators:

- Static (`/foo`, `/foo/bar`)
- Parameter (`/:title`, `/books/:title`, `/books/:genre/:title`)
- Parameter w/ Suffix (`/movies/:title.mp4`, `/movies/:title.(mp4|mov)`)
- Optional Parameters (`/:title?`, `/books/:title?`, `/books/:genre/:title?`)
- Wildcards (`*`, `/books/*`, `/books/:genre/*`)
- Optional Wildcard (`/books/*?`)

## Usage

```js
import { parse, inject } from './regexparam.js'

// Example param-assignment
function exec(path, result) {
    let i = 0,
        out = {}
    let matches = result.pattern.exec(path)
    while (i < result.keys.length) {
        out[result.keys[i]] = matches[++i] || null
    }
    return out
}

// Parameter, with Optional Parameter
// ---
let foo = parse('/books/:genre/:title?')
// foo.pattern => /^\/books\/([^\/]+?)(?:\/([^\/]+?))?\/?$/i
// foo.keys => ['genre', 'title']

foo.pattern.test('/books/horror') //=> true
foo.pattern.test('/books/horror/goosebumps') //=> true

exec('/books/horror', foo)
//=> { genre: 'horror', title: null }

exec('/books/horror/goosebumps', foo)
//=> { genre: 'horror', title: 'goosebumps' }

// Parameter, with suffix
// ---
let bar = parse('/movies/:title.(mp4|mov)')
// bar.pattern => /^\/movies\/([^\/]+?)\.(mp4|mov)\/?$/i
// bar.keys => ['title']

bar.pattern.test('/movies/narnia') //=> false
bar.pattern.test('/movies/narnia.mp3') //=> false
bar.pattern.test('/movies/narnia.mp4') //=> true

exec('/movies/narnia.mp4', bar)
//=> { title: 'narnia' }

// Wildcard
// ---
let baz = parse('users/*')
// baz.pattern => /^\/users\/(.*)\/?$/i
// baz.keys => ['*']

baz.pattern.test('/users') //=> false
baz.pattern.test('/users/lukeed') //=> true
baz.pattern.test('/users/') //=> true

// Optional Wildcard
// ---
let qux = parse('/users/*?')
// qux.pattern => /^\/users(?:\/(.*))?(?=$|\/)/i
// qux.keys => ['*']

qux.pattern.test('/users') //=> true
qux.pattern.test('/users/lukeed') //=> true
qux.pattern.test('/users/') //=> true

// Injecting
// ---

inject('/users/:id', {
    id: 'lukeed',
}) //=> '/users/lukeed'

inject('/movies/:title.mp4', {
    title: 'narnia',
}) //=> '/movies/narnia.mp4'

inject('/:foo/:bar?/:baz?', {
    foo: 'aaa',
}) //=> '/aaa'

inject('/:foo/:bar?/:baz?', {
    foo: 'aaa',
    baz: 'ccc',
}) //=> '/aaa/ccc'

inject('/posts/:slug/*', {
    slug: 'hello',
}) //=> '/posts/hello'

inject('/posts/:slug/*', {
    slug: 'hello',
    '*': 'x/y/z',
}) //=> '/posts/hello/x/y/z'

// Missing non-optional value
// ~> keeps the pattern in output
inject('/hello/:world', {
    abc: 123,
}) //=> '/hello/:world'
```

> **Important:** When matching/testing against a generated RegExp, your path **must** begin with a leading slash (`"/"`)!

## Regular Expressions

For fine-tuned control, you may pass a `RegExp` value directly to `parse()` as its only parameter.

In these situations, `regexparam` **does not** parse nor manipulate your pattern in any way. Because of this, `regexparam` has no "insight" on your route, and instead trusts your input fully. In code, this means that the return value's `keys` is always equal to `false` and the `pattern` is identical to your input value.

This also means that you must manage and parse your own `keys`. You may use [named capture groups](https://javascript.info/regexp-groups#named-groups) or traverse the matched segments manually:

```js
import { parse } from './regexparam.js'

// Named capture group
const named = parse(
    /^\/posts[/](?<year>[0-9]{4})[/](?<month>[0-9]{2})[/](?<title>[^\/]+)/i,
)
const { groups } = named.pattern.exec('/posts/2019/05/hello-world')
console.log(groups)
//=> { year: '2019', month: '05', title: 'hello-world' }

// "Old-fashioned" positional
const positional = parse(/^\/posts[/]([0-9]{4})[/]([0-9]{2})[/]([^\/]+)/i)
const [url, year, month, title] = positional.pattern.exec(
    '/posts/2019/05/hello-world',
)
console.log(year, month, title)
//=> 2019 05 hello-world
```

## API

### parse(input: string, loose?: boolean)

### parse(input: RegExp)

Returns: `{ keys: string[] | false, pattern: RegExp }`

Parse a route pattern into an equivalent RegExp pattern. Also collects the names of pattern's parameters as a `keys` array. An `input` that's already a RegExp is kept as is.

> **Important:** `keys` will _always_ be `false` when `input` is a RegExp and _always_ an Array when `input` is a string.

#### input

Type: `string` or `RegExp`

When a string, treated as a route pattern and an equivalent RegExp is generated. It does not matter if `input` begins with a `/` — it will be added if missing.

When a RegExp, used as-is with no modifications. `keys` will always be `false`.

#### loose

Type: `boolean`
Default: `false`

When `true`, the generated RegExp will match URLs longer than the pattern itself. Ignored when `input` is a RegExp.

```js
parse('/users').pattern.test('/users/lukeed') //=> false
parse('/users', true).pattern.test('/users/lukeed') //=> true

parse('/users/:name').pattern.test('/users/lukeed/repos') //=> false
parse('/users/:name', true).pattern.test('/users/lukeed/repos') //=> true
```

### inject(pattern: string, values: object)

Returns: `string`

Returns a new string by replacing the `pattern` segments with their matching `values`.

> **Important:** Named segments (eg, `/:name`) that _do not_ have a `values` match will be kept in the output. This is true _except for_ optional segments (eg, `/:name?`) and wildcard segments (eg, `/*`).

#### pattern

Type: `string`

The route pattern to receive injections.

#### values

Type: `Record<string, string>`

The values to be injected. Keys must match the pattern's segment names.

> **Note:** To replace a wildcard segment (`/*`), define a `values['*']` key.

## License

MIT © [Luke Edwards](https://lukeed.com)
