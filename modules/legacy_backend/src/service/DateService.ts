import { provide } from 'inversify-binding-decorators';

@provide(DateService)
export class DateService {
    public getCurrentDate(): Date {
        return new Date();
    }
}
