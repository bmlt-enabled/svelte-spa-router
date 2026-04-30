import Home from './routes/Home.svelte'
import About from './routes/About.svelte'
import Book from './routes/Book.svelte'
import NotFound from './routes/NotFound.svelte'

export const routes = {
    '/': Home,
    '/about': About,
    '/books/:id': Book,
    '*': NotFound,
}
