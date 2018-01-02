export class ExpenseDto{
    constructor(info, amount, tagId, timestamp){
        this.info = info;
        this.amount = amount;
        this.tagId = tagId;
        this.timestamp = timestamp;
    }
}