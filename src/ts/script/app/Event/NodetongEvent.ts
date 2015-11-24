import { NodetongEventType } from './NodetongEventType';

export interface NodetongEvent {
  code: NodetongEventType;
  payload: Array<any>;
}
