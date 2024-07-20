import { ContentType } from "./ModalContent";

export const SA_CONTENT:ContentType[] = [
    {title:'why the $',
     intro:`A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
            It is used for efficient substring searching and other string processing tasks.`,
     content:`
        The $ symbol is called a terminator in this context. It is used to determine when a suffix ends.
        Any character can serve as a terminator if it follows these conditions:

        1- It should be unique and not used in the text.
        2- It should be smaller than other characters in lexicographic comparison.
        Why would it help?
        Let's say you have the word "banana". By adding the terminator $, the word becomes "banana$".
        This helps in various string processing tasks, such as constructing a suffix tree or suffix array,
        because it ensures that no suffix is a prefix of another.
        This unique terminator simplifies comparisons and guarantees that the suffix tree is a proper tree with no ambiguities.
    `},
    {title:'sort characters',
    intro:``,
    content:`
        the first step is to sort the first character of each suffix, but you should use a stable sorting algorithm,
        these algorithms do not change the relative order of two equal items, here counting sort is used.
    `},
    {title:'compute equivalent classes',
    intro:``,
    content:`
        equivalent classes
    `},
    {title:'sort doubles',
    intro:``,
    content:``},
    {title:'update classes',
    intro:``,
    content:``},
] as const;

export const LCP_CONTENT:ContentType[] = [
    {title:'general startegy',
    intro:``,
    content:`
        LCP stands for 'longest common preffix', the LCP between 'aab', 'aac' is 'aa',
        the naive way to compute the LCP between all the suffixes in order is to compare all
        the characters between every two strings inorder, but there is a unique propraty,
        if i is the index of one suffix and j is the index of the nest inorder suffix after i,
        then the LCP bewteen suffix 'i - 1' and 'j - 1' is at least the LCP between i and j,
        we can use this to avoid repeating unnessciry comparisions.
    `},
    {title:'why suffix array',
    intro:``,
    content:`
        the suffix array is used to get the suffixes inorder, an inverse suffix array is made,
        where the index is the suffix and the value is the index to easly find the next suffix
    `},
    {title:'consturcting the array',
    intro:``,
    content:`
        start from the first suffix in the suffix array find the nest suffix to it,
        a helper function is needed to compare the suffixes, it should accept the suffix,
        next suffix and the current 'LCP - 1', where the current LCP starts at 0 and is reset
        to 0 when getting to the longest suffix, the array will be constucting randomly.
    `},
] as const;

export const ST_CONTENT:ContentType[] = [
    {title:'general startegy',
    intro:``,
    content:``},
    {title:'creating leaf node',
    intro:``,
    content:``},
    {title:'breaking node',
    intro:``,
    content:``},
    {title:'counstructing the tree',
    intro:``,
    content:``},
] as const;