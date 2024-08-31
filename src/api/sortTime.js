export function sortTime(list) {
    return list.sort(
        (a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}