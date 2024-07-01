let start = -1;
let end = start;


let ringBuffer = Array.from({length:2}).fill(undefined);

function add(item){
    if(isFull()){
        resize();
    }
    else if(isEmpty()){
        start ++;
    };
    end = (end + 1) % ringBuffer.length;
    ringBuffer[end] = item;
};

function pop(){
    if (isEmpty()){
        throw Error('queue is empty');
    };
    const temp = ringBuffer[start];
    if (start === end){
        start = end = -1;
    }
    else{
        start = (start + 1) % ringBuffer.length;
    };
    return temp;
};

function peak(){
    if (isEmpty()){
        throw Error('queue is empty');
    };
    return ringBuffer[start];
};

function isEmpty(){
    return start === -1;
};

function isFull(){
    return (end + 1) % ringBuffer.length === start;
};

function resize(){
    const temp = Array.from({length:ringBuffer.length * 2}).fill(undefined);
    let i = 0;
    let j = start;

    do {
        temp[i] = ringBuffer[j];
        i ++;
        j = (j + 1) % ringBuffer.length;
    } while (j !== end);

    temp[i] = ringBuffer[end];
    ringBuffer = temp;
    start = 0
    end = i;
};
