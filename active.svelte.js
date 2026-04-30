import { parse } from './regexparam.js'
import { router } from './Router.svelte'

/**
 * @typedef {Object} ActiveNode
 * @property {HTMLElement} node
 * @property {string} [className]
 * @property {string} [inactiveClassName]
 * @property {RegExp} pattern
 */

/** @type {ActiveNode[]} */
const nodes = []

/** @type {string} */
let location = ''

/** @param {ActiveNode} el */
function checkActive(el) {
    const matchesLocation = el.pattern.test(location)
    toggleClasses(el, el.className, matchesLocation)
    toggleClasses(el, el.inactiveClassName, !matchesLocation)
}

/**
 * @param {ActiveNode} el
 * @param {string|undefined} className
 * @param {boolean} shouldAdd
 */
function toggleClasses(el, className, shouldAdd) {
    ;(className || '').split(' ').forEach((cls) => {
        if (!cls) {
            return
        }
        // Remove the class firsts
        el.node.classList.remove(cls)

        // If the pattern doesn't match, then set the class
        if (shouldAdd) {
            el.node.classList.add(cls)
        }
    })
}

// Listen to changes in the location
$effect.root(() => {
    $effect(() => {
        const value = router.loc
        // Update the location
        location =
            value.location + (value.querystring ? '?' + value.querystring : '')

        // Update all nodes
        nodes.map(checkActive)
    })
})

/**
 * @typedef {Object} ActiveOptions
 * @property {string|RegExp} [path] - Path expression that makes the link active when matched (must start with '/' or '*'); default is the link's href
 * @property {string} [className] - CSS class to apply to the element when active; default value is "active"
 * @property {string} [inactiveClassName] - CSS class to apply to the element when inactive; nothing added by default
 */

/**
 * Svelte Action for automatically adding the "active" class to elements (links, or any other DOM element) when the current location matches a certain path.
 *
 * @param {HTMLElement} node - The target node (automatically set by Svelte)
 * @param {ActiveOptions|string|RegExp} [opts] - Can be an object of type ActiveOptions, or a string (or regular expressions) representing ActiveOptions.path.
 * @returns {{destroy: () => void}} Destroy function
 */
export default function active(node, opts) {
    // Check options
    /** @type {ActiveOptions} */
    let normalized
    if (typeof opts == 'string' || opts instanceof RegExp) {
        // Interpret strings and regular expressions as opts.path
        normalized = { path: opts }
    } else {
        // Ensure opts is a dictionary
        normalized = opts || {}
    }

    // Path defaults to link target
    if (!normalized.path && node.hasAttribute('href')) {
        const href = node.getAttribute('href')
        if (href && href.length > 1 && href.charAt(0) == '#') {
            normalized.path = href.substring(1)
        } else if (href) {
            normalized.path = href
        }
    }

    // Default class name
    if (!normalized.className) {
        normalized.className = 'active'
    }

    // If path is a string, it must start with '/' or '*'
    if (
        !normalized.path ||
        (typeof normalized.path == 'string' &&
            (normalized.path.length < 1 ||
                (normalized.path.charAt(0) != '/' &&
                    normalized.path.charAt(0) != '*')))
    ) {
        throw Error('Invalid value for "path" argument')
    }

    // If path is not a regular expression already, make it
    const { pattern } =
        typeof normalized.path == 'string'
            ? parse(normalized.path)
            : { pattern: normalized.path }

    // Add the node to the list
    const el = {
        node,
        className: normalized.className,
        inactiveClassName: normalized.inactiveClassName,
        pattern,
    }
    nodes.push(el)

    // Trigger the action right away
    checkActive(el)

    return {
        // When the element is destroyed, remove it from the list
        destroy() {
            nodes.splice(nodes.indexOf(el), 1)
        },
    }
}
