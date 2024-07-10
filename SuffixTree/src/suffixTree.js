const ALPHABET = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

function sortChars(s, alphabet){
    const order = Array(s.length).fill(-1);
    const count = Array(alphabet.length).fill(0);

    for (let i = 0; i < s.length; i ++){
        count[alphabet.indexOf(s[i].toLowerCase())] += 1;
    };

    for (let j = 1; j < count.length; j ++){
        count[j] += count[j - 1];
    };

    for (let i = s.length - 1; i >= 0; i --){
        count[alphabet.indexOf(s[i].toLowerCase())] -= 1;
        order[count[alphabet.indexOf(s[i].toLowerCase())]] = i;
    };

    return order;
};

function computeClasses(s, order){
    const classes = Array(order.length).fill(0);

    for (let i = 1; i < s.length; i ++){
        if (s[order[i]] !== s[order[i - 1]]){
            classes[order[i]] = classes[order[i - 1]] + 1;
        }else{
            classes[order[i]] = classes[order[i - 1]];
        };
    };

    return classes;
};

function sortingDoubles(s, l, order, classes){
    const newOrder = Array(s.length).fill(0);
    const count = Array(s.length).fill(0);

    for (let i = 0; i < s.length; i ++){
        count[classes[i]] += 1;
    };

    for (let j = 1; j < s.length; j ++){
        count[j] += count[j - 1];
    };

    for (let i = s.length - 1; i >= 0; i --){
        const start = (order[i] - l + s.length) % s.length;
        const cl = classes[start];
        count[cl] -= 1;
        newOrder[count[cl]] = start;
    };

    return newOrder;
};

function updateClasses(s, l, newOrder, classes){
    const newClasses = Array(s.length).fill(0);

    for (let i = 1; i < s.length; i ++){
        const curr = newOrder[i];
        const prev = newOrder[i - 1];
        const currMid = (curr + l) % s.length;
        const prevMid = (prev + l) % s.length;

        if (classes[curr] !== classes[prev] || classes[currMid] !== classes[prevMid]){
            newClasses[curr] = newClasses[prev] + 1;
        }else{
            newClasses[curr] = newClasses[prev];
        };
    };
    return newClasses;
};

function buildSuffixArray(s){
    let order = sortChars(s, ALPHABET);
    let classes = computeClasses(s, order);
    let l = 1;

    while (l < s.length){
        order = sortingDoubles(s, l, order, classes);
        classes = updateClasses(s, l, order, classes);
        l *= 2;
    };

    return order;
};

function compareLCP(s, i, j, lcp){
    let lcp_ = Math.max(0, lcp);
    while (i + lcp_ < s.length && j + lcp_ < s.length){
        if (s[i + lcp_] === s[j + lcp_]){
            lcp_ += 1;
        }else{
            break;
        };
    };

    return lcp_;
};



function computeLCPArray(s, suffixArray){
    const inverseSuffixArray = Array(suffixArray.length).fill(0);
    const lcpArray = Array(suffixArray.length - 1).fill(0);

    for (let i = 0; i < inverseSuffixArray.length; i++){
        inverseSuffixArray[suffixArray[i]] = i;
    };

    let lcp = 0;

    let suffix = suffixArray[0];
    for (let i = 0; i < s.length; i++){
        const currIndex = inverseSuffixArray[suffix];
        if (currIndex === s.length - 1){
            lcp = 0;
            suffix = (suffix + 1) % s.length;
            continue;
        };
        const nextSuffix = suffixArray[currIndex + 1];
        lcp = compareLCP(s, suffix, nextSuffix, lcp - 1);
        lcpArray[currIndex] = lcp;
        suffix = (suffix + 1) % s.length;
    };

    return lcpArray
};

const suffixArray = buildSuffixArray('helloworld');
const lcpArray = computeLCPArray('helloworld', suffixArray);