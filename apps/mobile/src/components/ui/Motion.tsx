/**
 * Central Moti re-export. All animated components import MotiView from here
 * so platform-level fallbacks can be applied in one place if ever needed.
 * (A duplicate-react install once broke Moti on web; deps are now deduped.)
 */
export { MotiView } from 'moti';
