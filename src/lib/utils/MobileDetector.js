import { writable } from 'svelte/store';

let isMobile = writable('detecting')

export { isMobile }