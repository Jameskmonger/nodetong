import { NodetongEvent } from '../Event/NodetongEvent';

export interface NodetongObserver {
  observed(event: NodetongEvent): void;
}
