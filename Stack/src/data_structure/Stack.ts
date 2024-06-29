export type Node<T> = {
    val:T;
    next?:Node<T> | undefined
}

export class Stack<T>{
    maxSize: number | undefined;
    size: number;
    head: Node<T> | undefined;

    constructor(maxSize:number | undefined = undefined) {
        this.maxSize = maxSize;
        this.size = 0;
        this.head = undefined;
    }

    push(item:T){
        if (this.size === this.maxSize){
            throw Error(`stack is at max size max size:${this.maxSize}`)
        };

        this.size += 1;

        const node:Node<T> = {val:item, next:undefined};
        if (!this.head){
            this.head = node;
            return;
        }

        node.next = this.head;
        this.head = node;
    };

    pop():T{
        if (!this.head){
            throw Error('cant pop empty stack');
        };

        this.size -= 1;
        const return_val = this.head;

        if (!this.head?.next){
            this.head = undefined
            return return_val.val
        };

        this.head.next = this.head
        return return_val.val
    };

    peak():T | undefined{
        return this.head?.val
    };
}
